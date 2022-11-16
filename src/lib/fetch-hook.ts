import { browser } from "$app/environment";

export {};
export function hookFetch(alert: (a: AlertSpec)=> void) {
	if(browser) {
		const oldFetch = fetch;
		window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
			const rv = await oldFetch(input, init);
			if(!rv.ok)
				alert({message: (await rv.json()).message || rv.statusText, color: 'danger'});
			return rv;
		}
	}
	return alert;
}