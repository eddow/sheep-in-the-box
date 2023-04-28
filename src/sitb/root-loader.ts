import { gotTree, setLanguage } from "$sitb/intl";
import type { Role } from "$sitb/constants";
import { setGlobalUser } from "$sitb/user";

export default function loadSideR(data: any) {
	setLanguage(data.language, false);
	const roles: Role[] = [<Role>''];
	if(data.user) roles.push('lgdn');
	if(data.user?.roles) roles.push(...data.user.roles.split('|'));
	gotTree({tree: data.dictionary, roles});
	setGlobalUser(data.user);
	return data;
}