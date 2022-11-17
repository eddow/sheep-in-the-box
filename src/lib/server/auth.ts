import { map } from "./db";
import User, { Registration, Session } from "$lib/server/objects/user";
import type { RequestEvent } from "@sveltejs/kit";
import md5 from "md5";
import { LOGGEDIN_TIMEOUT, SMTP_HOST, SMTP_PORT, SMTP_SENDER, SMTP_USER, SMTP_PASS }  from "$env/static/private";
import type { Language } from "./objects/intl";
import { markdown } from "markdown";
import { createTransport } from "nodemailer";
import { parmed } from "$lib/intl";
import { getText } from "./intl";
import { dev } from "$app/environment";

const liTimeout = +(LOGGEDIN_TIMEOUT || 300) * 1000;

const users = map(User);
const regs = map(Registration);
const sessions = map(Session);

export function userPublic(user: User) {
	return user && {email: user.email, language: user.language, roles: ('lgdn '+user.roles).trimEnd()};
}
// TODO Clean sessions regularly
export async function authed(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
	const authKey = event.cookies.get('session');
	if(!authKey) return null;
	const ts = (new Date).getTime();
	let rv: Session|undefined = await sessions.findOne({authKey});
	if(rv && ts-rv.ts > liTimeout) {
		await sessions.deleteMany(authKey);
		rv = undefined;
	}
	let user = null;
	if(rv) {
		user = await users.findOne({email: rv.email});
		await sessions.updateMany({email: rv.email}, {$set: {ts}})
	} else {
		if(authKey) event.cookies.delete('session', {path: '/'});
		return null;
	}
	return event.locals.user = userPublic(user);
}

export async function login(event: RequestEvent<Partial<Record<string, string>>, string | null>, email: string, password: string) {
	const authKey = md5(crypto.randomUUID());
	const one = await users.findOne({email, password: md5(password)});
	if(!one) return null;
	event.locals.user = userPublic(one);
	await sessions.updateMany({email}, {$set: {authKey, ts: Date.now()}}, {upsert: true})
	event.cookies.set('session', authKey, {
		path: '/',
		sameSite: 'strict',
		secure: !dev,
		maxAge: 60 * 60 * 24 * 30
	});
	return userPublic(one);
}

export async function logout(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
	const authKey = event.cookies.get('session');
	if(!authKey) return false;
	await sessions.deleteMany({authKey});
	delete event.locals.user;
	event.locals.language = event.cookies.get('language');
	return true;
}

export async function changePass(event: RequestEvent<Partial<Record<string, string>>, string | null>, oldPass: string, newPass: string) {
	const one = await users.findOne({email: event.locals.user.email, password: md5(oldPass)});
	if(!one) return false;
	one.password = md5(newPass);
	await one.save();
	return true;
}

// TODO Clean codes regularly
export async function registration(code: string) : Promise<string> {
	return (await regs.aggregate([
		{$match: {code}},
		{$project: {email: 1}}
	]))[0]?.email;
}

export async function userExists(email: string) {
	return !!(await users.aggregate([
			{$match: {email}},
			{$count: 'count'}
		]))[0]?.count;
}

export async function setLanguage(email: string, language: Language) {
	await users.findOneAndUpdate({email}, {$set:{language}});
}

//#region Register/lost pw

const transport = createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});
export async function register(event: RequestEvent<Partial<Record<string, string>>, string | null>, email: string) {
	const code = md5(crypto.randomUUID()),
			mailType = (await userExists(email)) ? 'chg-pw' : 'register',
		parms = {'code-url': `${event.url.origin}/${event.locals.language}/user/${code}`},
		[subject, html, text] = await Promise.all([
			getText(`mail.${mailType}.topic`, event.locals.language),
			getText(`mail.${mailType}.md`, event.locals.language).then(c=> markdown.toHTML(parmed(c, parms))),
			getText(`mail.${mailType}.txt`, event.locals.language).then(c=> parmed(c, parms))
		]), mailOptions = {
			from: SMTP_SENDER,
			to: email,
			subject, html, text
		}, ts = Date.now();
	await regs.updateMany({email}, {$set:{code, ts}}, {upsert: true});
	return new Promise<void>(
		(resolve: (value: void)=> void, reject: (reason: any)=> void)=> {
			transport.sendMail(mailOptions, function(error: any){
				if(error) reject(error); else resolve();
			});
		});
}

export async function useCode(code: string, password: string) {
	// TODO check ts ?
	const email = (await regs.findOne({code}))?.email;
	if(email) {
		regs.deleteMany({email});
		return await users.updateMany({email}, {$set: {password: md5(password)}}, {upsert: true});
	}
}

//#endregion