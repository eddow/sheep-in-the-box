import { allDB } from "$sitb/server/export";
import { json, text, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent) {	//authed
	event.setHeaders({
		'Content-Type': 'app/json',
    	'Content-Disposition': 'attachment; filename="sitb.json"'
	});
	return text(JSON.stringify(await allDB(), null, '\t'));
}