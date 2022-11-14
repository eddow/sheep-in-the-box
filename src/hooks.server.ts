import "dotenv/config";
import type { Handle } from '@sveltejs/kit';
import { authed } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	await authed(event);
	return await resolve(event);
};
