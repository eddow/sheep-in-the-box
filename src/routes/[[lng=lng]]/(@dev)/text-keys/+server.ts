import { json } from '@sveltejs/kit';
import { getDevDictionary } from '$lib/server/intl';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {	// Unused: loaded in `PageData`
	return json(await getDevDictionary(event.locals.user.language));
}