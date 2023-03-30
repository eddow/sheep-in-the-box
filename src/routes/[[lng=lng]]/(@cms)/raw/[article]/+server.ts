import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { saveFile, renameImage, deleteImg } from '$sitb/server/article';

export async function POST(event: RequestEvent) {
	const
		{params: {article}} = event,
		{name, type, content} = await event.request.json();
	let finalName = await saveFile(article, name, type, content);
	return json({name: finalName});
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