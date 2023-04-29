import { json } from '@sveltejs/kit';
import { getTradDictionaries, setTexts } from '$sitb/server/intl';
import type { RequestEvent } from './$types';
import { ok } from '$sitb/utils';

export async function GET(event: RequestEvent) {	// Note: never used
	return json(await getTradDictionaries());
}

export async function PATCH(event: RequestEvent) {	// modify
	const {key, diff} = await event.request.json();
	await setTexts(key, diff);
	return ok();
}