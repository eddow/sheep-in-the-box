import { error, type Handle } from '@sveltejs/kit';
import { authed } from '$lib/server/auth';
import type { RequestEvent } from "@sveltejs/kit";
import { languages } from "$lib/server/objects/intl";

function allGroups(rex: RegExp, hay: string, grpIndex: number) {
	const rv = [];
	let m = rex.exec(hay);
	while(m) {
		rv.push(m[grpIndex]);
		m = rex.exec(hay)
	}
	return rv;
}

export const handle: Handle = async ({ event, resolve }: {event: RequestEvent<Partial<Record<string, string>>, string | null>, resolve: any}) => {
	const user = await authed(event);
	event.locals.SSR = true;
	event.locals.language = event.params.lng || user?.language || event.cookies.get('language');
	if(!event.locals.language) {
		event.locals.language = event.request.headers.get('accept-language')?.
			split(';').map(x=> x.split(' ')[1]).
			find(x=> x && languages.hasOwnProperty(x)) || 'en';
		event.cookies.set('language', event.locals.language, {
			path: '/',
			sameSite: 'strict',
			//secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});
	}
	if(event.route.id) {
		for(const group of allGroups(/\/\(@(.*?)\)\//g, event.route.id, 1))
			if(!user || !!~user.roles.indexOf(group))
				throw error(401, `Unauthorized (@${group})`)
	}
	return await resolve(event);
};
