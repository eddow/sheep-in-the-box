function allGroups(rex: RegExp, hay: string, grpIndex: number) {
	const rv = [];
	let m = rex.exec(hay);
	while(m) {
		rv.push(m[grpIndex]);
		m = rex.exec(hay)
	}
	return rv;
}

export function accessible(routeId: string, user: any) {
	for(const group of allGroups(/\/\(@(.*?)\)\//g, routeId, 1))
		if(!user || (group !== 'cust' && !~user.roles.indexOf(group))) {
			console.log(401, `Unauthorized (@${group})`);
			return false;
		}
	return true;
}