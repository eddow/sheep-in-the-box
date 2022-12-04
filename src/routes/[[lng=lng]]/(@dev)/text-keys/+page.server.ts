import { getDevDictionary } from "$lib/server/intl";
 
export const load = async ({locals}: Partial<Record<string, any>>) => {
	return {
		dictionary: await getDevDictionary(locals.preferences.devKeysLng || locals.user.language)
	};
}