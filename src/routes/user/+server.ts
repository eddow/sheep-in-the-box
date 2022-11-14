import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { login, logout } from "$lib/server/auth";
import type User from '$lib/objects/user';
import md5 from 'md5';

export const POST: RequestHandler = async (event) => {	//login
console.log('loggin-in')
	const {email, password} = await event.request.json();
	let rv = await login(event, email, md5(password));
	if(!rv) throw error(401, 'Bad login')
	new Response()
	return json({email: rv.email, language: rv.language, roles: rv.roles});
}