import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { login, logout, authed, changePass } from "$lib/server/auth";
import type { Role } from '$lib/objects/user';
import { tree } from '$lib/server/intl';

export const GET: RequestHandler = async (event) => {	//authed
	return json(await authed(event));
}

export const POST: RequestHandler = async (event) => {	//login
	const {email, password, roles} = await event.request.json();
	// roles is the list of roles for whom the client has the dictionary already
	let user = await login(event, email, password);
	if(!user) throw error(401, 'Bad login')
	const toSendRoles = user.roles.split(',').concat(['']).filter(r=> !~roles.indexOf(r)), rv: any = {user};
	if(toSendRoles.length)
		rv.dictionary = {roles: toSendRoles, tree: await tree(user.language, toSendRoles)}
	return json(rv);
}

export const PUT: RequestHandler = async (event) => {	//register
	//TODO send emails
	return json(true);
}

export const PATCH: RequestHandler = async (event) => {	//change pass
	if(!event.locals.user) throw error(400, 'Not logged in.')
	const {oldPass, newPass} = await event.request.json();
	
	return new Response(null, {status: await changePass(event, oldPass, newPass) ? 200 : 401});
}

export const DELETE: RequestHandler = async (event) => {	//logout
	return json(logout(event));
}