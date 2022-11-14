import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { login, logout, authed } from "$lib/server/auth";
import type User from '$lib/objects/user';

export const GET: RequestHandler = async (event) => {	//authed
	return json(await authed(event));
}

export const POST: RequestHandler = async (event) => {	//login
	const {email, password} = await event.request.json();
	let rv = await login(event, email, password);
	if(!rv) throw error(401, 'Bad login')
	return json(rv);
}

export const DELETE: RequestHandler = async (event) => {	//logout
	return json(logout(event));
}