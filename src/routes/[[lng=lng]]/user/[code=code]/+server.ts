import { useCode } from '$lib/server/user';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
	return new Response(null, {status: await useCode(
		<string>event.params.code,
		(await event.request.json()).pass
	) ? 200 : 401})
}