import { json } from '@sveltejs/kit';
import { login, logout, patchUser, register } from "$sitb/server/user";
import { flat, tree } from '$sitb/server/intl';
import type { RequestEvent } from './$types';
import { nodulesData } from '$sitb/server/root-loader';
import { setCookie } from '$sitb/cookies';

export async function POST(event: RequestEvent) {	//login
	const {roles, email, pass, gglToken} = await event.request.json();
	// roles is the list of roles for whom the client already has the dictionary
	let user = await login(event, {email, pass, gglToken});
	if(!user) {
		logout(event);
		return json(event.locals.language, {status: 401});
	}
	const toSendRoles = (user.roles?.split('|')||[]).concat(['']).filter(r=> !roles.includes(r)), rv: any = {user};
	if(toSendRoles.length)
		rv.dictionary = {roles: toSendRoles, tree: tree(await flat(user.language, toSendRoles))}
	rv.nodules = await nodulesData(event);
	return json(rv);
}

export async function PUT(event: RequestEvent) {	//register
	const {email} = await event.request.json();
	return json(register(event, email));
}

export async function PATCH (event: RequestEvent) {	// set language
	const {language, roles} = await event.request.json();
	event.locals.language = language;
	const user = event.locals.user,
		toSendRoles = (<string>user?.roles)?.split(' ').concat(['']).filter((r: string)=> !roles?.includes(r)) || [''], rv: any = {};
	if(user) {
		patchUser(user.email, {language});
	} else
		setCookie('language', language);
	if(toSendRoles.length)
		return json({roles: toSendRoles, tree: tree(await flat(language, toSendRoles))});
	return json(false)
}