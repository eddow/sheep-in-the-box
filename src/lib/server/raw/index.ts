import md5 from 'md5';
import { RAW_FILES }  from '$env/static/private';

import fsRaw from './fs';

const raw: Raw.Access | undefined = RAW_FILES ? fsRaw(RAW_FILES) : undefined;
console.assert(raw, 'Raw file access configured');

export async function save(type: string, content: Uint8Array) {
	let hash = <string>md5(content);
	await raw!.save(hash, {type, content});
	return hash;
}
export async function load(hash: string) {
	const rv = await raw!.load(hash);
	if(typeof rv === 'string') {
		// TODO? string = redirect
	} else return {hash, ...rv};
}