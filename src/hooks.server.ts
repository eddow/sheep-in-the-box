import type { Handle, HandleServerError } from '@sveltejs/kit';
import { authed } from '$lib/server/auth';
import type { RequestEvent } from "@sveltejs/kit";
import { languages } from "$lib/server/objects/intl";
import { accessible } from '$lib/auth';
import { resetDictionaries } from '$lib/intl';
import { flat, t } from '$lib/server/intl';

export const handle: Handle = async ({ event, resolve }: {event: RequestEvent<Partial<Record<string, string>>, string | null>, resolve: any}) => {
	const user = await authed(event);
	event.locals.language = event.params.lng || user?.language || event.cookies.get('language');
	resetDictionaries();
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
	event.locals.dictionary = await flat(event.locals.language, (event.locals.user?.roles.split(' ') || []).concat(['']));
	if(event.route.id && !accessible(event.route.id, user))
		return new Response(null, {status: 303, headers: {location: '/'}});
	return await resolve(event);
};

const codes: Record<string, string> = {
	11000: 'err.dup-key'
}
export function handleError({error, event}: {error: {code: number}, event: RequestEvent<Partial<Record<string, string>>, string | null>}, stuff: any) {
	if(!codes[error.code]) {
		console.error(error);
	}
	return {message: t(codes[error.code] || 'err.internal')};
}