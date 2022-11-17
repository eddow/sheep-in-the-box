import { allDB } from "$lib/server/export";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent) {	//authed
	event.setHeaders({
		'Content-Type': 'app/json',
    	'Content-Disposition': 'attachment; filename="sitb.json"'
	});
	return json(await allDB());
}