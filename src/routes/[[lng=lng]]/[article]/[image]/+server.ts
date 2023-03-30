import { error, json, text } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { loadFile } from '$sitb/server/article';

export async function GET(e: RequestEvent) {
	const
		{params: {article, image}} = e,
		rv = await loadFile(article, image);
		
	e.setHeaders({'content-type': rv.type});
	return new Response(rv.file);
}
