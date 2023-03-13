import { getTradDictionaries } from "$lib/server/intl";

export async function load(event: Partial<Record<string, any>>) {
	/*const lngs = locals.preferences.tradLngs,
		list = lngs ?
			lngs.replace(':', '.').split('.').filter((x: string)=> x !== 'key') :
			[locals.language];*/
	return {
		transls: await getTradDictionaries()
	};
}