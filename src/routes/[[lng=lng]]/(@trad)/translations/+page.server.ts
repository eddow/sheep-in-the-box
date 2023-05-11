import { getTradDictionaries } from "$sitb/server/intl";

export async function load(event: Partial<Record<string, any>>) {
	return {
		transls: await getTradDictionaries()
	};
}