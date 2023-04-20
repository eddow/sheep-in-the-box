declare module raw {
	interface ImageInfo {
		type: string;
		content: Uint8Array
	}
	interface Access {
		save(hash: string, image: ImageInfo): Promise<void>;
		load(hash: string, trf?: [number, number?]): Promise<ImageInfo | string>;
		remove(hash: string): Promise<void>;
	}
}