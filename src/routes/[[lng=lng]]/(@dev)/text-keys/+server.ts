import { error, json } from '@sveltejs/kit';
import { create, deleteKey, getDevDictionary, renameKey, setRoles, setTexts } from '$lib/server/intl';
import type { RequestEvent } from './$types';
import type { Role } from '$lib/constants';
import { t } from '$lib/server/intl';

export async function GET(event: RequestEvent) {	// Unused: loaded in `PageData`
	return json(await getDevDictionary(event.locals.user.language));
}

export async function POST(event: RequestEvent) {	// create
	const {language, key, text, role} = await event.request.json();
	return json(await create(language, key, text, role));
}

export async function PUT(event: RequestEvent) {	// rename key
	const {oldK, newK} = await event.request.json();
	const krv = await renameKey(oldK, newK);
	if(!krv) throw error(400, await t('err.dup-key'));
	return json(krv);
}

export async function DELETE(event: RequestEvent) {	// delete ALL from key
	const {key} = await event.request.json();
	return json(await deleteKey(key));
}

export async function PATCH(event: RequestEvent) {	// modify
	const {language, key, text, role} = await event.request.json();
	const promises = [];
	if(typeof text !== 'undefined') promises.push(setTexts(key, {[language]: text}));
	if(typeof role !== 'undefined') promises.push(setRoles(key, <Role>role));
	return json(await Promise.all(promises));
}