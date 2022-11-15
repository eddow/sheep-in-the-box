import { gotTree } from "$lib/intl";
import type { Role } from "$lib/constants";
import type { PageLoad } from "./$types";
import { language } from "$lib/intl";

export const load: PageLoad = async ({data}: {data: any}) => {
	language.set(data.language);
	const roles: Role[] = [<Role>''];
	if(data.user?.roles) roles.push(...data.user.roles.split(' '));
	gotTree({tree: data.dictionary, roles});
	return data;
}