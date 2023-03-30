import { error, json } from '@sveltejs/kit';
import { getArticle, setArticle, setText } from '$sitb/server/article';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {
	debugger;
	
	return json({ok: true})
}

export async function PATCH(e: RequestEvent) {	// modify
	const
		{params: {article: name}} = e,
		{lng, diff} = await e.request.json();
	await setText(name, lng, diff);
	return json({ok: true});
}