import { map } from './db';
import User from '$lib/objects/user';
import type { RequestEvent } from "@sveltejs/kit";
import md5 from "md5";

interface LoggedIn {
	user: User|string;
	lastInterraction: number;
}
const loggedIn: Record<string, LoggedIn> = {};
const liTimeout = +(process.env.LOGGEDIN_TIMEOUT || 300) * 1000;

export function userPublic(user: User) {
	return user && {email: user.email, language: user.language, roles: user.roles};
}

export function clean() {
	const ts = (new Date).getTime();
	for(const key of Object.keys(loggedIn))
		if(ts-loggedIn[key].lastInterraction > liTimeout)
			delete loggedIn[key];
}

export async function authed(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
	const authKey = event.cookies.get('session');
	if(!authKey) return false;
	const ts = (new Date).getTime();
	let rv: LoggedIn|undefined = loggedIn[authKey];
	if(rv && ts-rv.lastInterraction > liTimeout) {
		delete loggedIn[authKey];
		rv = undefined;
	}
	let user = null;
	if(rv) {
		user = rv.user;
		if(!(user instanceof User)) {
			const users = map(User);
			user = await users.findById(user);
		}
	}
	if(!user) {
		if(authKey) event.cookies.delete('session', {path: '/'});
		return false;
	}
	rv!.lastInterraction = ts;
	return event.locals.user = userPublic(user);
}

export async function login(event: RequestEvent<Partial<Record<string, string>>, string | null>, email: string, password: string) {
	const uuid = md5(crypto.randomUUID());
	const users = map(User);
	const one = await users.findOne({email, password: md5(password)});
	if(!one) return false;
	event.locals.user = userPublic(one);
	const li: LoggedIn = {
		user: one.get('id'),
		lastInterraction: (new Date).getTime()
	};
	loggedIn[uuid] = li;
	event.cookies.set('session', uuid, {
		path: '/',
		sameSite: 'strict',
		//secure: !dev,
		maxAge: 60 * 60 * 24 * 30
	});
	return userPublic(one);
}

export function logout(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
	const authKey = event.cookies.get('session');
	if(!authKey) return false;
	delete loggedIn[authKey];
	return true;
}

export function register(event: RequestEvent<Partial<Record<string, string>>, string | null>, email: string, password: string) {
	//TODO
}