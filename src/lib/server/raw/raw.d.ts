declare module Raw {
	interface ImageInfo {
		type: string;
		content: Uint8Array
	}
	interface Access {
		save(hash: string, image: ImageInfo): Promise<void>;
		load(hash: string): Promise<ImageInfo | string>;
	}
}