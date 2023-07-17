import { json, type RequestEvent } from '@sveltejs/kit';
import { flat, tree } from '$sitb/server/intl';
import { persistPreference, patchUser, logout, changePass } from '$sitb/server/user';
import { setCookie } from '$sitb/cookies';
import { nodulesData } from '$sitb/server/root-loader';
import { ok } from '$sitb/utils.js';

// API related to "my user"

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