import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { flat, tree } from '$lib/server/intl';
import { setLanguage } from '$lib/server/auth';
import { dev } from '$app/environment';
import { setCookie } from '$lib/cookies';

export const POST: RequestHandler = async (event) => {	//set language
	const {language, roles} = await event.request.json();
	event.locals.language = language;
	const user = event.locals.user,
		toSendRoles = user?.roles.split(' ').concat(['']).filter((r: string)=> !~roles.indexOf(r)) || [''], rv: any = {};
	if(user) {
		setLanguage(user.email, language);
	} else
		setCookie('language', language);
	if(toSendRoles.length)
		return json({roles: toSendRoles, tree: tree(await flat(language, toSendRoles))});
	return json(false)
}