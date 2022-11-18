import { tree } from "$lib/server/intl";

export const load = async (event: Partial<Record<string, any>>) => {
	const language = event.locals.language;
	return {
		user: event.locals.user,
		language,
		dictionary: await tree(event.locals.dictionary)
	};
}