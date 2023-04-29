import { useCode } from '$sitb/server/user';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
	await useCode(
		<string>event.params.code,
		(await event.request.json()).pass,
		event.locals.language
	);
	return new Response(null, {status: 200})
}