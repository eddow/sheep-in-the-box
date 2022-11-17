import type { Handle, HandleServerError } from '@sveltejs/kit';
import { authed } from '$lib/server/auth';
import type { RequestEvent } from "@sveltejs/kit";
import { languages } from "$lib/server/objects/intl";
import { allGroups } from '$lib/auth';
import { resetDictionaries } from '$lib/intl';
import { flat, t } from '$lib/server/intl';
import { dev } from '$app/environment';

// Version when `user.roles` is still a string
function accessible(routeId: string, user: any) {
	for(const group of allGroups(/\/\(@(.*?)\)\//g, routeId, 1))
		if(!user || (group !== 'lgdn' && !~user.roles.indexOf(group))) {
			console.log('CS-401', `Unauthorized (@${group})`);
			return false;
		}
	return true;
}
// TODO Client navigation on a forbidden page once unlogged from another tab causes some weird 500 without XHR
export const handle: Handle = async ({ event, resolve }: {event: RequestEvent<Partial<Record<string, string>>, string | null>, resolve: any}) => {
	const user = await authed(event), languageCookie = event.cookies.get('language');
	resetDictionaries();
	event.locals.language = event.params.lng || user?.language || languageCookie ||
		event.request.headers.get('accept-language')?.
			split(';').map(x=> x.split(' ')[1]).
			find(x=> x && x in languages) ||
		'en';
	if(!languageCookie && !user?.language)
		event.cookies.set('language', event.locals.language, {
			path: '/',
			sameSite: 'strict',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});
	event.locals.dictionary = await flat(event.locals.language, (event.locals.user?.roles.split(' ') || []).concat(['']));
	if(event.route.id && !accessible(event.route.id, user)) {
		return new Response('{}', /^text\/html/.test(event.request.headers.get('accept') || '') ? 
			{status: 303, headers: {location: '/'}} :
			{status: 401, statusText: 'Not authorized'});
	}
	return await resolve(event, {transformPageChunk(opts: { html: string, done: boolean }) {
		return opts.html.replaceAll('%language%', event.locals.language);
	}});
};

const codes: Record<string, string> = {
	11000: 'err.key.dup'
}
export function handleError({error, event}: {error: {code: number}, event: RequestEvent<Partial<Record<string, string>>, string | null>}, stuff: any) {
	if(!codes[error.code]) {
		console.error(error);
	}
	return {message: t(codes[error.code] || 'err.internal')};
}