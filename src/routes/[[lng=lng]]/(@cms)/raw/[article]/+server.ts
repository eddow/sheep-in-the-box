import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { saveFile, renameImage, deleteImg } from '$sitb/server/article';

export async function POST(event: RequestEvent) {
	const
		{params: {article}} = event,
		fd = await event.request.formData(),
		file = fd.get('file');
	return json({name: await saveFile(article, file.name, file.type, new Uint8Array(await file.arrayBuffer()))});
}

export async function PATCH(event: RequestEvent) {
	const
		{params: {article}} = event,
		{name, newName} = await event.request.json();
	await renameImage(article, name, newName);
	return json({ok: true});
}

export async function DELETE(event: RequestEvent) {
	const
		{params: {article}} = event,
		{name} = await event.request.json();
	await deleteImg(article, name);
	return json({ok: true});
}