import { tree } from "$sitb/server/intl";

export async function load({locals}: Partial<Record<string, any>>) {
	return {
		user: locals.user,
		language: locals.language,
		preferences: locals.preferences,
		dictionary: await tree(locals.dictionary)
	};
}
