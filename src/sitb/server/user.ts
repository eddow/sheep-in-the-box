import { User, UserRegistration, UserSession } from "$entities/sitb/user";
import { error, type RequestEvent } from "@sveltejs/kit";
import md5 from "md5";
import { LOGGEDIN_TIMEOUT, SMTP_HOST, SMTP_PORT, SMTP_SENDER, SMTP_USER, SMTP_PASS, REGISTRATION_TIMEOUT }  from "$env/static/private";
import type { Language } from "$sitb/constants";
import { createTransport } from "nodemailer";
import { parmed } from "$sitb/intl";
import { getText } from "./intl";
import { stringCookies } from "$sitb/cookies";
import { serialize } from "@mikro-orm/core";
import { analyseRoles } from "$sitb/user";
import em from "./db";

const liTimeout = (LOGGEDIN_TIMEOUT ? +LOGGEDIN_TIMEOUT : 5*60) * 1000,
	regTimeout = (REGISTRATION_TIMEOUT ? +REGISTRATION_TIMEOUT : 1*60*60)*1000

const
	users = em.getRepository(User),
	regs = em.getRepository(UserRegistration),
	sessions = em.getRepository(UserSession);

// TODO Call `cleanup` regularly (each day/hour)
export async function cleanup() {
	const ts = Date.now();
	return await Promise.all([
		regs.nativeDelete({ts: {$lt: ts-regTimeout}}),
		sessions.nativeDelete({ts: {$lt: ts-liTimeout}})
	]);
}

export async function authed(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
	const authKey = event.cookies.get('session');
	if(!authKey) return null;
	let rv = await sessions.findOne({authKey}, {populate: ['user']});
	if(rv && Date.now()-rv.ts > liTimeout) {
		await em.removeAndFlush(rv);
		rv = null;
	}
	if(rv) {
		// Refresh the maxAge
		await em.persistAndFlush(rv);
		stringCookies.session = authKey;
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
	event.locals.roles = analyseRoles(user.roles);
	return event.locals.user = serialize(user);
}

export async function logout(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
	const authKey = event.cookies.get('session');
	if(!authKey) return false;
	await sessions.nativeDelete({authKey});
	delete event.locals.user;
	event.locals.language = <Language>event.cookies.get('language');
	event.locals.roles = {lgdn: false};
	return true;
}

export async function changePass(event: RequestEvent<Partial<Record<string, string>>, string | null>, oldPass: string, newPass: string) {
	return users.nativeUpdate({email: event.locals.user!.email, password: md5(oldPass)}, {password: md5(newPass)});
}

export async function registration(code: string) : Promise<UserRegistration> {
	const ts = (new Date).getTime();
	const reg = await regs.findOneOrFail({code});
	
	if(ts-reg.ts > regTimeout) {
		await em.removeAndFlush(reg);
		throw error(404, code)
	}
	return reg;
}

export async function userExists(email: string) {
	const [_, count] = await users.findAndCount({email});
	return !!count;
}

export async function listUsers() {
	return <User[]>serialize(await users.findAll());
}

export async function patchUser(email: string, diff: {email?: string, roles?: string, language?: Language}) {
	return users.nativeUpdate({email}, diff);
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
	await em.persistAndFlush(user);
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

export async function useCode(code: string, password: string, language: Language) {
	const reg = await registration(code);
	
	let [user, _] = await Promise.all([users.findOne({email: reg.email}), em.removeAndFlush(reg)]);
	if(!user) user = users.create({email: reg.email, roles: 'new', language});
	user.password = md5(password);
	return em.persistAndFlush(user);
}

//#endregion