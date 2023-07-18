import { error, json } from '@sveltejs/kit';
import { create, deleteKey, getDevDictionary, setKeyInfo, setTexts } from '$sitb/server/intl';
import type { RequestEvent } from './$types';
import { i } from '$sitb/server/intl';
import type { Language } from '$sitb/constants';

export async function GET(event: RequestEvent) {
	const language = event.url.search.substring(1);
	return json(language ? await getDevDictionary(<Language>language) : false);
}

export async function POST(event: RequestEvent) {	// create
	const {language, key, text, roles, type} = await event.request.json();
	try {
		return json(await create(language, key, text, roles, type));
	} catch(x: any) {
		if(x.code == 11000)
			throw error(400, i('err.key.dup', event));
		throw x;
	}
}

export async function DELETE(event: RequestEvent) {	// delete ALL from key
	const {key} = await event.request.json();
	return json(await deleteKey(key));
}

export async function PATCH(event: RequestEvent) {	// modify
	const {language, key, diff: {text, ...diff}} = await event.request.json();
	const promises = [];
	if(text !== undefined) promises.push(setTexts(key, <Record<Language,string>>{[language]: text}));
	if(Object.keys(diff).length) promises.push(setKeyInfo(key, diff));
	return json(await Promise.all(promises));
}