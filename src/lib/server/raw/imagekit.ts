import ImageKit from "imagekit";
import { ImageKitOptions } from 'imagekit/dist/libs/interfaces';

const path = '/sitb/';
export default function ikAccess(options: ImageKitOptions) : raw.Access {
	const imagekit = new ImageKit(options);
	return {
		async save(hash: string, image: raw.ImageInfo) {
			const rv = await imagekit.upload({
				file: Buffer.from(image.content),
				folder: path,
				fileName: hash,
				useUniqueFileName: false
			});
			debugger;
		},
		async load(hash: string, trf?: [number, number?]): Promise<string> {
			//const desc = await raw.findOne({hash});
			return imagekit.url({
				path: path+hash,
				...(trf ? {
					width: trf[0],
					...(trf[1] ? {height: trf[1]} : {})
				} : {})
			})
		}
	}
}