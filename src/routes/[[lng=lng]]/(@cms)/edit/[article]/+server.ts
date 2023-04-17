import { json } from '@sveltejs/kit';
import { deleteArticle, setArticle, setText } from '$sitb/server/article';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {
	debugger;
	
	return json({ok: true})
}

export async function POST(e: RequestEvent) {	// modify texts
	const
		{params: {article: name}} = e,
		{lng, diff} = await e.request.json();
	await setText(name, lng, diff);
	return json({ok: true});
}

export async function PATCH(e: RequestEvent) {	// modify name/type
	const
		{params: {article: name}} = e,
		{diff} = await e.request.json();
	await setArticle(name, diff);
	return json({ok: true});
}

export async function DELETE(e: RequestEvent) {	// Delete: article, texts, images
	const {params: {article: name}} = e;
	await deleteArticle(name);
	return json({ok: true});
}