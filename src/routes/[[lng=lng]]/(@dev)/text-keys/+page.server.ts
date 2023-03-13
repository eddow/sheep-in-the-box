import { getDevDictionary } from "$lib/server/intl";
 
export async function load({locals}: Partial<Record<string, any>>) {
	return {
		dictionary: await getDevDictionary(locals.preferences.devKeysLng || locals.user.language)
	};
}