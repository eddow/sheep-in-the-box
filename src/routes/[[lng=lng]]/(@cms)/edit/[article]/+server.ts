import { json } from '@sveltejs/kit';
import { deleteArticle, setArticle, setText } from '$sitb/server/article';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {
	debugger;
	
	return json({ok: true})
}

export async function POST(e: RequestEvent) {	// modify texts
	const
		{params: {article}} = e,
		{lng, diff} = await e.request.json();
	await setText(article, lng, diff);
	return json({ok: true});
}

export async function PATCH(e: RequestEvent) {	// modify name/type
	const
		{params: {article}} = e,
		{diff} = await e.request.json();
	await setArticle(article, diff);
	return json({ok: true});
}

export async function DELETE(e: RequestEvent) {	// Delete: article, texts, images
	const {params: {article}} = e;
	await deleteArticle(article);
	return json({ok: true});
}