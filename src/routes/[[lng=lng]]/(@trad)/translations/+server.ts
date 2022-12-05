import { error, json } from '@sveltejs/kit';
import { create, deleteKey, getDevDictionary, getTradDictionaries, renameKey, setKeyInfo, setTexts } from '$lib/server/intl';
import type { RequestEvent } from './$types';
import { t } from '$lib/server/intl';
import type { Language } from '$lib/constants';

export async function GET(event: RequestEvent) {	// Note: never used
	return json(await getTradDictionaries());
}

export async function PATCH(event: RequestEvent) {	// modify
	const {key, diff} = await event.request.json();
	return json(await setTexts(key, diff).then(x=> { if(!x) throw error(500, 'Key does not exists'); }));
}