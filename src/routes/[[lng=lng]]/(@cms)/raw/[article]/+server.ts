import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { saveFile } from '$sitb/server/article';

export async function POST(event: RequestEvent) {
	const
		{params: {article}} = event,
		{name, type, content} = await event.request.json();
	await saveFile(article, name, type, content);
	return json({ok: true});
}
