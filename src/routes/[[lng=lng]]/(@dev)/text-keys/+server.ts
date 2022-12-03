import { error, json } from '@sveltejs/kit';
import { create, deleteKey, getDevDictionary, renameKey, setKeyInfo, setTexts } from '$lib/server/intl';
import type { RequestEvent } from './$types';
import { t } from '$lib/server/intl';

export async function GET(event: RequestEvent) {	// Unused: loaded in `PageData`
	return json(await getDevDictionary(event.locals.user.language));
}

export async function POST(event: RequestEvent) {	// create
	const {language, key, text, role, type} = await event.request.json();
	try {
		return json(await create(language, key, text, role, type));
	} catch(x: any) {
		if(x.code == 11000)
			throw error(400, await t('err.key.dup'));
		throw x;
	}
}

export async function PUT(event: RequestEvent) {	// rename key
	const {oldK, newK} = await event.request.json();
	const krv = await renameKey(oldK, newK);
	if(!krv) throw error(400, await t('err.key.dup'));
	return json(krv);
}

export async function DELETE(event: RequestEvent) {	// delete ALL from key
	const {key} = await event.request.json();
	return json(await deleteKey(key));
}

export async function PATCH(event: RequestEvent) {	// modify
	const {language, key, text, role, type} = await event.request.json();
	const promises = [];
	if(typeof text !== 'undefined') promises.push(setTexts(key, {[language]: text})
		.then(x=> { if(!x) throw error(500, 'Key does not exists'); }));
	let keyInfo:any = {};
	if(typeof role !== 'undefined') keyInfo.role = role;
	if(typeof type !== 'undefined') keyInfo.type = type;
	if(Object.keys(keyInfo).length) promises.push(setKeyInfo(key, keyInfo));
	return json(await Promise.all(promises));
}