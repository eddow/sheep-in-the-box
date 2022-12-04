import { error, json } from '@sveltejs/kit';
import { create, deleteKey, getDevDictionary, getTradDictionaries, renameKey, setKeyInfo, setTexts } from '$lib/server/intl';
import type { RequestEvent } from './$types';
import { t } from '$lib/server/intl';
import type { Language } from '$lib/constants';

export async function GET(event: RequestEvent) {
	const languages = event.url.search.substring(1).split('.');
	return json(languages[0] ? await getTradDictionaries(<Language[]>languages) : false);
}

export async function PATCH(event: RequestEvent) {	// modify
	const {language, key, text} = await event.request.json();
	return json(await setTexts(key, {[language]: text}).then(x=> { if(!x) throw error(500, 'Key does not exists'); }));
}