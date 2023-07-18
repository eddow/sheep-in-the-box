import { IMAGEKIT_PATH } from "$env/static/private";
import ImageKit from "imagekit";
import type { ImageKitOptions } from 'imagekit/dist/libs/interfaces';

const path = IMAGEKIT_PATH;
export default function ikAccess(options: ImageKitOptions) : raw.Access {
	const imagekit = new ImageKit(options);
	return {
		async save(hash: string, image: raw.ImageInfo) {
			await imagekit.upload({
				file: Buffer.from(image.content),
				folder: path,
				fileName: hash,
				useUniqueFileName: false
			});
		},
		async load(hash: string, trf?: [number, number?]): Promise<string> {
			return imagekit.url({
				path: path+hash,
				transformation: [
					...(trf ? [{width: trf[0], ...(trf[1] ? {height: trf[1]} : {})}] : []),
				]
			})
		},
		async remove(hashes: string[]) {
			const files = await Promise.all(hashes.map(name=> imagekit.listFiles({path, name})));
			const fileIds = files.map(f=> f[0]?.fileId).filter(f=> f);
			// Split fileIds in chunks of 100
			const chunks: string[][] = [];
			for(let i=0; i<fileIds.length; i+=100)
				chunks.push(fileIds.slice(i, i+100));
			await Promise.all(chunks.map(ids=> imagekit.bulkDeleteFiles(ids)));
		}
	}
}