import type { Handle } from '@sveltejs/kit';
import { authed } from '$lib/server/auth';
import type { RequestEvent } from "@sveltejs/kit";
import { languages } from "$lib/server/objects/intl";
import { accessible } from '$lib/auth';
import { resetDictionaries } from '$lib/intl';

export const handle: Handle = async ({ event, resolve }: {event: RequestEvent<Partial<Record<string, string>>, string | null>, resolve: any}) => {
	const user = await authed(event);
	event.locals.SSR = true;
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
	if(event.route.id && !accessible(event.route.id, user))
		return new Response(null, {status: 303, headers: {location: '/'}});
	return await resolve(event);
};
