import { error, json, redirect, text } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { loadFile } from '$sitb/server/article';
import resizeImg from 'resize-img';

// TODO: cache

export async function GET(e: RequestEvent) {
	const
		inm = e.request.headers.get('If-None-Match'),
		{params: {article, image}, url: {search}} = e,
		rv = await loadFile(article, image, inm);
	if(rv === true) throw redirect(304, 'Hash cached');
	if(!rv) throw error(404, article+'/'+image);
	let file = rv.file;
	if(search) {
		let [width, height] = search.substr(1).split('x').map(x=> +x);
		file = await resizeImg(file, height ? {width, height} : {width});
	}
	e.setHeaders({
		'content-type': rv.type,
		//'Cache-Control': 'public, max-age=3600',
		ETag: rv.hash
	});
	return new Response(file);
}
