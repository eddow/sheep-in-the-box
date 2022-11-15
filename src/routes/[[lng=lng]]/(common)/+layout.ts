import { gotTree } from "$lib/intl";
import type { Role } from "$lib/server/objects/user";
import type { PageLoad } from "./$types";
import { language } from "$lib/intl";

export const load: PageLoad = async ({data}: {data: any}) => {
	debugger;
	language.set(data.language);
	const roles: Role[] = [<Role>''];
	if(data.user?.roles) roles.push(...data.user.roles.split(' '));
	gotTree({tree: data.dictionary, roles});
}