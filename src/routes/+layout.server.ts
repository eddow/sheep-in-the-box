import { tree } from "$sitb/server/intl";

export async function load({locals}: {locals: App.Locals}) {
	return {
		user: locals.user,
		language: locals.language,
		dictionary: await tree(locals.dictionary)
	};
}
