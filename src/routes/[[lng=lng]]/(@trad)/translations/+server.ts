import { error, json } from '@sveltejs/kit';
import { getTradDictionaries, setTexts } from '$sitb/server/intl';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {	// Note: never used
	return json(await getTradDictionaries());
}

export async function PATCH(event: RequestEvent) {	// modify
	const {key, diff} = await event.request.json();
	return json(await setTexts(key, diff).then(x=> { if(!x) throw error(500, 'Key does not exists'); }));
}