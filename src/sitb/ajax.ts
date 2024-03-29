import { toast } from "svemantic";

interface Ajax {
	(input: RequestInfo | URL, init?: RequestInit, throughStatus?: number[]): Promise<Response>;
	get(url?: string): Promise<Response>;
	post(body: any, url?: string, throughStatus?: number[]): Promise<Response>;
	put(body: any, url?: string, throughStatus?: number[]): Promise<Response>;
	patch(body: any, url?: string, throughStatus?: number[]): Promise<Response>;
	delete(body: any, url?: string, throughStatus?: number[]): Promise<Response>;
}

function shortCut(method: string, body?: any, url?: string, throughStatus?: number[]) {
	const init: any = {method};
	if(body) init.body = JSON.stringify(body);
	return ajax(url || '', init, throughStatus)
}

export const ajax: Ajax = Object.assign(async (input: RequestInfo | URL, init?: RequestInit, throughStatus?: number[]): Promise<Response>=> {
	const rv = await fetch(input, init);
	if(!rv.ok && (!throughStatus || !throughStatus.includes(rv.status)))
		toast({message: (await rv.json()).message || rv.statusText, class: 'error'});
	return rv;
}, {
	get(url?: string, throughStatus?: number[]) { return shortCut('GET', null, url, throughStatus); },
	post(body: any, url?: string, throughStatus?: number[]) { return shortCut('POST', body, url, throughStatus); },
	put(body: any, url?: string, throughStatus?: number[]) { return shortCut('PUT', body, url, throughStatus); },
	patch(body: any, url?: string, throughStatus?: number[]) { return shortCut('PATCH', body, url, throughStatus); },
	delete(body: any, url?: string, throughStatus?: number[]) { return shortCut('DELETE', body, url, throughStatus); }
})