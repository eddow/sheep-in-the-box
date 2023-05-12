import Raws from '$entities/sitb/raw';
import { join } from 'path';
import { promises as fs } from 'fs';
import em from "../db";

// TODO: Never tested
const raws = em.getRepository(Raws);
export default function fsAccess(path: string) : raw.Access {
	return {
		async save(hash: string, image: raw.ImageInfo) {
			await Promise.all([
				fs.writeFile(join(path, hash), image.content),
				raws.upsert({hash, type: image.type})
			]);
		},
		async load(hash: string): Promise<raw.ImageInfo> {
			const [content, desc] = await Promise.all([
				fs.readFile(join(path, hash)),
				raws.findOneOrFail({hash})
			]);
			return {content, type: desc.type};
		},
		async remove(hashes: string[]) {
			await Promise.all([
				...hashes.map(hash=> fs.unlink(join(path, hash))),
				raws.nativeDelete({hash: {$in: hashes}})
			]);
		}
	}
}