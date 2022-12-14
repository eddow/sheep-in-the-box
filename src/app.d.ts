// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Language } from "$lib/constants";

// and what to do when importing types
declare namespace App {
	interface Locals {
		user: User;
		language: Language;
		dictionary: Record<string, string>;
		preferences: Record<string, any>;
	}
	
	interface Error {
		message: string;
		code: string;
	}
}

declare module 'markdown';