import { tree } from "$sitb/server/intl";
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { authed, persistPreference } from '$sitb/server/user';
import { languages, type Language } from "$sitb/server/objects/intl";
import { accessible, allGroups, setSSPersistPreference } from '$sitb/user';
import { resetDictionaries } from '$sitb/intl';
import { flat, i } from '$sitb/server/intl';
import { setCookie, setSSR } from '$sitb/cookies';
import em from '$sitb/server/db';
import { RequestContext } from '@mikro-orm/core';
import { setGlobicGetter } from '$sitb/globic';
import { AsyncLocalStorage } from 'async_hooks';
import { importNodules } from "$sitb/nodules";
import { analyseRoles } from "$sitb/user";

export default async function locals2data(e: RequestEvent) {
	const locals = e.locals;
	return {
		user: locals.user,
		language: locals.language,
		dictionary: tree(locals.dictionary),
		nodules: await nodulesData(e)
	};
}

export async function nodulesData(e: RequestEvent) {
	return Object.fromEntries(
		await Promise.all(Object.entries(await importNodules('server', e.locals.roles))
			.map(async ([k, v])=> [k, await v?.load(e)]))
	);
}

const globicStore = new AsyncLocalStorage<Record<string, any>>();
setGlobicGetter(()=> globicStore.getStore());

export const serve: Handle = async ({ event, resolve })=> {
	setSSR(event.cookies);
	setSSPersistPreference(persistPreference);
	return globicStore.run({}, async ()=>
		RequestContext.createAsync(em, async ()=> {
			const user = await authed(event);
			resetDictionaries();
			let llng = event.params.lng || user?.language || event.cookies.get('language');
			if(!llng) {
				llng = event.request.headers.get('accept-language')?.
						split(';').map(x=> x.split(' ')[1]).
						find(x=> x && x in languages) ||
					'en'
				setCookie('language', llng);
			}
			event.locals.language = <Language>llng;
			event.locals.preferences = (user ? user.preferences || (user.preferences = {}) : event.cookies.get('preferences')) || {};
			event.locals.dictionary = await flat(event.locals.language, ((event.locals.user?.roles)?.split(' ') || []).concat(['']));
			event.locals.roles = analyseRoles(user?.roles);
			if(event.route.id && !accessible(event.route.id, event.locals.roles) && !/^text\/html/.test(event.request.headers.get('accept') || '')) {
				return new Response('"Not avail"', {status: 401, statusText: 'Not authorized'});
			}
			return resolve(event, {
				transformPageChunk(opts: { html: string, done: boolean }) {
					return opts.html.replaceAll('%language%', event.locals.language);
				}
			});
		}));
};

// TODO hook.ts error logging