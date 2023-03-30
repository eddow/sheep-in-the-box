import { error, json } from '@sveltejs/kit';
import { getArticle, setArticle, setText } from '$sitb/server/article';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {
	debugger;
	
	return json({ok: true})
}

export async function PATCH(event: RequestEvent) {	// modify
	/*const {key, diff} = await event.request.json();
	return json(await setTexts(key, diff).then(x=> { if(!x) throw error(500, 'Key does not exists'); }));*/
}