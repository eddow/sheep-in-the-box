import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { flat, tree } from '$lib/server/intl';
import { setLanguage, persistPreference } from '$lib/server/user';
import { setCookie } from '$lib/cookies';

////// API related to "my user"

export const POST: RequestHandler = async (event) => {	// set language
	const {language, roles} = await event.request.json();
	event.locals.language = language;
	const user = event.locals.user,
		toSendRoles = (<string>user?.roles)?.split(' ').concat(['']).filter((r: string)=> !~roles.indexOf(r)) || [''], rv: any = {};
	if(user) {
		setLanguage(user.email, language);
	} else
		setCookie('language', language);
	if(toSendRoles.length)
		return json({roles: toSendRoles, tree: tree(await flat(language, toSendRoles))});
	return json(false)
}

export const PATCH: RequestHandler = async (event) => {	// set/delete preference
	const {name, value} = await event.request.json();
	return json(await persistPreference(event.locals.user.email, name, value));
}