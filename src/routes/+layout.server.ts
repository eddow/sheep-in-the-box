import locals2data from "$sitb/server/root-loader";
import type { RequestEvent } from "@sveltejs/kit";

export async function load(e: RequestEvent) {
	return await locals2data(e);
}