import md5 from 'md5';
import {
	RAW_FILES,
	IMAGEKIT_PUBLIC, IMAGEKIT_PRIVATE, IMAGEKIT_ENDPOINT
} from '$env/static/private';

import fsAccess from './fs';
import ikAccess from './imagekit';

const raw: raw.Access | undefined =
	RAW_FILES ? fsAccess(RAW_FILES) :
	IMAGEKIT_PUBLIC ? ikAccess({
		publicKey: IMAGEKIT_PUBLIC,
		privateKey: IMAGEKIT_PRIVATE,
		urlEndpoint: IMAGEKIT_ENDPOINT
	}) :
	undefined;
console.assert(raw, 'Raw file access configured');

export async function save(type: string, content: Uint8Array) {
	let hash = <string>md5(content);
	await raw!.save(hash, {type, content});
	return hash;
}

export async function load(hash: string, trf?: [number, number?]) {
	const rv = await raw!.load(hash, trf);
	return (typeof rv === 'string')  ? rv :  {hash, ...rv};
}

export async function remove(hashes: string[]) {
	return raw!.remove(hashes);
}