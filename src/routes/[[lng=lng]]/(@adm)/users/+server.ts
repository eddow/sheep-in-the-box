import { patchUser } from '$lib/server/user';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function PATCH(event: RequestEvent) {	// modify
	const {_id, ...diff} = await event.request.json();
	return json(await patchUser(_id, diff));
}