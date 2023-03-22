import { error, json } from '@sveltejs/kit';
import { login, logout, changePass, register } from "$sitb/server/user";
import { flat, tree } from '$sitb/server/intl';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {	//authed
	return json(event.locals);
}

export async function POST(event: RequestEvent) {	//login
	const {email, password, roles} = await event.request.json();
	// roles is the list of roles for whom the client already has the dictionary
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
	if(!event.locals.user) throw error(401, 'Not logged in.')
	const {passCur, passNew} = await event.request.json();
	
	return new Response(null, {status: await changePass(event, passCur, passNew) ? 200 : 401});
}

export async function DELETE(event: RequestEvent) {	//logout
	return json(await logout(event) ? event.locals.language : false);
}