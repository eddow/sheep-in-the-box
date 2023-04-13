import Raw from '../objects/raw';
import { map } from '../db';
import { join } from 'path';
import { promises as fs } from 'fs';

const raw = map(Raw);
export default function fsAccess(path: string) : Raw.Access {
	return {
		async save(hash: string, image: Raw.ImageInfo) {
			await Promise.all([
				fs.writeFile(join(path, hash), image.content),
				raw.updateMany({hash}, {$set: {type: image.type}}, {upsert: true})
			]);
		},
		async load(hash: string): Promise<Raw.ImageInfo> {
			const [content, desc] = await Promise.all([
				fs.readFile(join(path, hash)),
				raw.findOne({hash})
			]);
			return {content, type: desc.type};
		}
	}
}