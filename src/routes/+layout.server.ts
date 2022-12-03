import { tree } from "$lib/server/intl";

export const load = async (event: Partial<Record<string, any>>) => {
	return {
		user: event.locals.user,
		language: event.locals.language,
		preferences: event.locals.preferences,
		dictionary: await tree(event.locals.dictionary)
	};
}