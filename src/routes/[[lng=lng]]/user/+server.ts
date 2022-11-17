import { error, json } from '@sveltejs/kit';
import { login, logout, authed, changePass, register } from "$lib/server/auth";
import { flat, tree } from '$lib/server/intl';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {	//authed
	return json(await authed(event));
}

export async function POST(event: RequestEvent) {	//login
	const {email, password, roles} = await event.request.json();
	// roles is the list of roles for whom the client has the dictionary already
	let user = await login(event, email, password);
	if(!user) {
		logout(event);
		return json(event.locals.language, {status: 401});
	}
	const toSendRoles = user.roles.split(' ').concat(['']).filter(r=> !~roles.indexOf(r)), rv: any = {user};
	if(toSendRoles.length)
		rv.dictionary = {roles: toSendRoles, tree: tree(await flat(user.language, toSendRoles))}
	return json(rv);
}

export async function PUT(event: RequestEvent) {	//register
	const {email} = await event.request.json();
	return json(register(event, email));
}

export async function PATCH(event: RequestEvent) {	//change pass
	if(!event.locals.user) throw error(400, 'Not logged in.')
	const {oldPass, newPass} = await event.request.json();
	
	return new Response(null, {status: await changePass(event, oldPass, newPass) ? 200 : 401});
}

export async function DELETE(event: RequestEvent) {	//logout
	return json(logout(event) ? event.locals.language : false);
}