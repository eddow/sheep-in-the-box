import { map, stringIds } from "./db";
import User, { UserRegistration, UserSession } from "$sitb/entities/user";
import { error, type RequestEvent } from "@sveltejs/kit";
import md5 from "md5";
import { LOGGEDIN_TIMEOUT, SMTP_HOST, SMTP_PORT, SMTP_SENDER, SMTP_USER, SMTP_PASS, REGISTRATION_TIMEOUT }  from "$env/static/private";
import type { Language } from "./objects/intl";
import { createTransport } from "nodemailer";
import { parmed } from "$sitb/intl";
import { getText } from "./intl";
import { stringCookies } from "$sitb/cookies";

import em from "./db";
import { serialize, wrap } from "@mikro-orm/core";

const liTimeout = (LOGGEDIN_TIMEOUT ? eval(LOGGEDIN_TIMEOUT) : 5*60) * 1000,
	regTimeout = (REGISTRATION_TIMEOUT ? eval(REGISTRATION_TIMEOUT) : 1*60*60)*1000

const
	users = em.getRepository(User),
	regs = em.getRepository(UserRegistration),
	sessions = em.getRepository(UserSession);

// TODO Call `cleanup` regularly (each day/hour)
export async function cleanup() {
	const ts = Date.now();
	return await Promise.all([
		regs.removeAndFlush(regs.find({ts: {$lt: ts-regTimeout}})),
		sessions.removeAndFlush(sessions.find({ts: {$lt: ts-regTimeout}}))
	]);
}

export async function authed(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
	const authKey = event.cookies.get('session'), ts = (new Date).getTime();
	if(!authKey) return null;
	let rv = await sessions.findOne({authKey}, {populate: ['user']});
	if(rv && ts-rv.ts > liTimeout) {
		await sessions.removeAndFlush(rv);
		rv = null;
	}
	if(rv) {
		rv.ts = ts;
		await sessions.persistAndFlush(rv);
		stringCookies.session = authKey;	// Refresh the maxAge
	} else {
		if(authKey) event.cookies.delete('session', {path: '/'});
		return null;
	}
	return event.locals.user = serialize(rv.user);
}

export async function login(event: RequestEvent<Partial<Record<string, string>>, string | null>, email: string, password: string) {
	const authKey = md5(crypto.randomUUID());
	const user = await users.findOne({email, password: md5(password)});
	if(!user) return null;
	await sessions.upsert({user: user._id, authKey, ts: Date.now()});
	stringCookies.session = authKey;
	event.locals.language = user.language;
	return event.locals.user = serialize(user);
}

export async function logout(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
	const authKey = event.cookies.get('session');
	if(!authKey) return false;
	let session = await sessions.findOneOrFail({authKey});
	await sessions.removeAndFlush(session);
	delete event.locals.user;
	event.locals.language = <Language>event.cookies.get('language');
	return true;
}

export async function changePass(event: RequestEvent<Partial<Record<string, string>>, string | null>, oldPass: string, newPass: string) {
	const user = await users.findOneOrFail({email: event.locals.user!.email, password: md5(oldPass)});
	user.password = md5(newPass);
	return em.persistAndFlush(user);
}

export async function registration(code: string) : Promise<UserRegistration> {
	const ts = (new Date).getTime();
	const reg = await regs.findOneOrFail({code});
	
	if(ts-reg.ts > regTimeout) {
		await regs.removeAndFlush(reg);
		throw error(404, code)
	}
	return reg;
}

export async function userExists(email: string) {
	return !!(await users.aggregate([
			{$match: {email}},
			{$count: 'count'}
		]))[0]?.count;
}

export async function listUsers() {
	return stringIds(await users.aggregate([{
		$project: {email: 1, roles: 1}
	}]));
}

export async function patchUser(email: string, diff: {email?: string, roles?: string, language?: Language}) {
	const user = await users.findOneOrFail({email});
	wrap(user).assign(diff);
	return em.persistAndFlush(user);
}

// Used by server/root-loader to access directly the DB instead of cookies or XHR
export async function persistPreference(email: string, name: string, value?: any) {
	const user = await users.findOneOrFail({email});
	if(value === undefined) {
		if(!user.preferences || !(name in user.preferences)) return user.preferences || {};
		const {[name]: _, ...unprefed} = user.preferences;
		user.preferences = unprefed;
	} else if(user.preferences) user.preferences = {...user.preferences, [name]: value};
	else user.preferences = {[name]: value};
	await users.persistAndFlush(user);
	return user.preferences;
}

//#region Register/lost pw

const transport = createTransport({
	host: SMTP_HOST,
	port: +SMTP_PORT,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS
	}
});
export async function register(event: RequestEvent<Partial<Record<string, string>>, string | null>, email: string) {
	const code = md5(crypto.randomUUID()),
			mailType = (await userExists(email)) ? 'chg-pw' : 'register',
		parms = {'code-url': `${event.url.origin}/${event.locals.language}/${code}`},
		[subject, html, text] = await Promise.all([
			getText(`mail.${mailType}.topic`, event.locals.language),
			getText(`mail.${mailType}.html`, event.locals.language).then(c=> /*markdown.toHTML(*/parmed(c, parms)/*)*/),
			getText(`mail.${mailType}.txt`, event.locals.language).then(c=> parmed(c, parms))
		]), mailOptions = {
			from: SMTP_SENDER,
			to: email,
			subject, html, text
		}, ts = Date.now();
	await regs.upsert({email, code, ts});
	return new Promise<void>(
		(resolve: (value: void)=> void, reject: (reason: any)=> void)=> {
			transport.sendMail(mailOptions, function(error: any){
				if(error) reject(error); else resolve();
			});
		});
}

export async function useCode(code: string, password: string) {
	const reg = await registration(code);
	
	await regs.removeAndFlush(reg);
	return users.upsert({email:reg.email, password: md5(password)})
}

//#endregion