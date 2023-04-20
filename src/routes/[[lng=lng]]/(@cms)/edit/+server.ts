import { json } from '@sveltejs/kit';
import { createArticle } from '$sitb/server/article';
import type { RequestEvent } from './$types';

export async function POST(e: RequestEvent) {	// create
	const {slug, type} = await e.request.json();
	await createArticle(slug, type);
	return json({ok: true});
}