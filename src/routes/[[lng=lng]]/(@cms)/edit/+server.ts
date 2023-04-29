import { createArticle } from '$sitb/server/article';
import type { RequestEvent } from './$types';

export async function POST(e: RequestEvent) {	// create
	const {slug, type} = await e.request.json();
	await createArticle(slug, type);
	return new Response(null, {status: 200});
}