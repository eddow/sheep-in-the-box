import type { Language } from "$sitb/constants";
import { getDevDictionary } from "$sitb/server/intl";
 
export async function load({locals}: {locals: App.Locals}) {
	return {
		dictionary: await getDevDictionary(<Language>locals.preferences.devKeysLng || locals.language)
	};
}