import { getDevDictionary } from "$lib/server/intl";
 
export const load = async (event: Partial<Record<string, any>>) => {
	return {
		dictionary: await getDevDictionary(event.locals.user.language)
	};
}