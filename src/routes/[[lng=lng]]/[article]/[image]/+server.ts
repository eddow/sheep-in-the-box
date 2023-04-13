import { error, json, redirect, text } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { loadFile } from '$sitb/server/article';
import Jimp from 'jimp';

export async function GET(e: RequestEvent) {
	const
		inm = e.request.headers.get('If-None-Match'),
		{params: {article, image}, url: {search}} = e,
		rv = await loadFile(article, image, inm);
	if(rv === true) throw redirect(304, 'Hash cached');
	if(!rv) throw error(404, article+'/'+image);
	let {content, type} = rv;
	if(search) {
		let [width, height] = search.substr(1).split('x').map(x=> +x);
		const image = await Jimp.read(content);
		await image.resize(width, height || Jimp.AUTO);
		content = await image.getBufferAsync(Jimp.MIME_JPEG);
		type = 'image/jpeg';
	}
	e.setHeaders({
		'content-type': type,
		//'Cache-Control': 'public, max-age=3600',
		ETag: rv.hash
	});
	return new Response(content);
}
