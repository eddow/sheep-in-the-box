import { json, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { renameImage, deleteImg, copyImg } from '$sitb/server/article';

export async function GET({params: {article, image}, url}: RequestEvent) {
	throw redirect(302, '/'+article+'/'+image + url.search);
}

export async function PATCH({params: {article, image}, request}: RequestEvent) {
	const {name} = await request.json();
	await renameImage(article, image, name);
	return json({ok: true});
}

export async function DELETE({params: {article, image}}: RequestEvent) {
	await deleteImg(article, image);
	return json({ok: true});
}

export async function PUT({params: {article, image}, request}: RequestEvent) {
	const {slug, name} = await request.json();
	await copyImg({slug, name}, {slug: article, name: image});
	return json({ok: true});
}