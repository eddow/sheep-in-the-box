import { gotTree, languageStore } from "$lib/intl";
import type { Role } from "$lib/constants";

export async function load({data}: {data: any}) {
	languageStore.value = data.language;
	const roles: Role[] = [<Role>''];
	if(data.user?.roles) roles.push(...data.user.roles.split(' '));
	gotTree({tree: data.dictionary, roles});
	return data;
}