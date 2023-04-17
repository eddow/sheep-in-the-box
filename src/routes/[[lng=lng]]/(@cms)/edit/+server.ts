import { json } from '@sveltejs/kit';
import { createArticle } from '$sitb/server/article';
import type { RequestEvent } from './$types';

export async function POST(e: RequestEvent) {	// create
	const {name, type} = await e.request.json();
	await createArticle(name, type);
	return json({ok: true});
}