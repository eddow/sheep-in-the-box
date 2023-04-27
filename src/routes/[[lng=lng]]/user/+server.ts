import { json } from '@sveltejs/kit';
import { login, logout, changePass, register } from "$sitb/server/user";
import { flat, tree } from '$sitb/server/intl';
import type { RequestEvent } from './$types';

export async function POST(event: RequestEvent) {	//login
	const {email, pass, roles} = await event.request.json();
	// roles is the list of roles for whom the client already has the dictionary
	let user = await login(event, email, pass);
	if(!user) {
		logout(event);
		return json(event.locals.language, {status: 401});
	}
	const toSendRoles = (user.roles?.split('|')||[]).concat(['']).filter(r=> !roles.includes(r)), rv: any = {user};
	if(toSendRoles.length)
		rv.dictionary = {roles: toSendRoles, tree: tree(await flat(user.language, toSendRoles))}
	return json(rv);
}

export async function PUT(event: RequestEvent) {	//register
	const {email} = await event.request.json();
	return json(register(event, email));
}