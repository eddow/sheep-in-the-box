import { error, json } from '@sveltejs/kit';
import { deleteArticle, saveFile, setArticle, setText } from '$sitb/server/article';
import type { RequestEvent } from './$types';
import { ok } from '$sitb/utils';

export async function POST({params: {article}, request}: RequestEvent) {	// Upload image
	const
		fd = await request.formData(),
		file = <File | null>fd.get('file');
	return file ?
		json({name: await saveFile(article, file.name, file.type, new Uint8Array(await file.arrayBuffer()))}) :
		error(400, 'No file');
}
export async function PUT(e: RequestEvent) {	// modify texts
	const
		{params: {article}} = e,
		{lng, diff} = await e.request.json();
	await setText(article, lng, diff);
	return ok();
}

export async function PATCH(e: RequestEvent) {	// modify name/type
	const
		{params: {article}} = e,
		{diff} = await e.request.json();
	await setArticle(article, diff);
	return ok();
}

export async function DELETE(e: RequestEvent) {	// Delete: article, texts, images
	const {params: {article}} = e;
	await deleteArticle(article);
	return ok();
}