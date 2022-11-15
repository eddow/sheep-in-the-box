import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { tree } from '$lib/server/intl';

export const POST: RequestHandler = async (event) => {	//set language
	const {language, roles} = await event.request.json();
	event.locals.language = language;
	const user = event.locals.user,
		toSendRoles = user?.roles.split(' ').concat(['']).filter((r: string)=> !~roles.indexOf(r)) || [''], rv: any = {};
	if(toSendRoles.length)
		return json({roles: toSendRoles, tree: await tree(language, toSendRoles)});
	return json(false)
}