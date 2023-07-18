import { patchUser } from '$sitb/server/user';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function PATCH(event: RequestEvent) {	// modify
	const {email, diff} = await event.request.json();
	return json(await patchUser(email, diff));
}