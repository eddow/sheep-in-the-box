import md5 from 'md5';
import Raw from './objects/raw';
import { RAW_FILES }  from '$env/static/private';
import { map } from './db';
import { join } from 'path';
import { promises as fs } from 'fs';

const raw = map(Raw);

export async function save(type: string, content: string) {
	let hash = <string>md5(content);
	await Promise.all([
		fs.writeFile(join(RAW_FILES, hash), content, 'base64'),
		raw.updateMany({hash}, {$set: {type}}, {upsert: true})
	]);
	return hash;
}
export async function load(hash: string) {
	const [file, desc] = await Promise.all([
		fs.readFile(join(RAW_FILES, hash)),
		raw.findOne({hash})
	]);
	return {file, type: desc.type, hash};
}