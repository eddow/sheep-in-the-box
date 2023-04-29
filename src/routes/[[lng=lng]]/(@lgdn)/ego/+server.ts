import { json, type RequestEvent } from '@sveltejs/kit';
import { flat, tree } from '$sitb/server/intl';
import { persistPreference, patchUser, logout, changePass } from '$sitb/server/user';
import { setCookie } from '$sitb/cookies';
import { nodulesData } from '$sitb/server/root-loader';
import { ok } from '$sitb/utils.js';

// API related to "my user"

export async function POST (event: RequestEvent) {	// set language
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

export async function PATCH(event: RequestEvent) {	// set/delete preference
	const {name, value} = await event.request.json();
	return json(await persistPreference(event.locals.user!.email, name, value));
}

export async function DELETE(event) {	//logout
	return json(await logout(event) ? {
		language: event.locals.language,
		nodules: await nodulesData(event)
	} : false);
}

export async function PUT(event: RequestEvent) {	//change pass
	const {passCur, passNew} = await event.request.json();
	await changePass(event, passCur, passNew);
	return ok();
}