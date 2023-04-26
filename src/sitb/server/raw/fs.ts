import RawTable from '../objects/raw';
import { map } from '../db';
import { join } from 'path';
import { promises as fs } from 'fs';

const raw = map(RawTable);
export default function fsAccess(path: string) : raw.Access {
	return {
		async save(hash: string, image: raw.ImageInfo) {
			await Promise.all([
				fs.writeFile(join(path, hash), image.content),
				raw.updateMany({hash}, {$set: {type: image.type}}, {upsert: true})
			]);
		},
		async load(hash: string): Promise<raw.ImageInfo> {
			const [content, desc] = await Promise.all([
				fs.readFile(join(path, hash)),
				raw.findOne({hash})
			]);
			return {content, type: desc.type};
		},
		async remove(hashes: string[]) {
			await Promise.all([
				...hashes.map(hash=> fs.unlink(join(path, hash))),
				raw.deleteMany({hash: hashes})
			]);
		}
	}
}