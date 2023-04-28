import { tree } from "$sitb/server/intl";

export default async function locals2data(locals: App.Locals) {
	return {
		user: locals.user,
		language: locals.language,
		dictionary: await tree(locals.dictionary)
	};
}