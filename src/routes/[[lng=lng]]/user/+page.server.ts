import { redirect } from "@sveltejs/kit";

export async function load({parent}: {parent: any}) {
	let data = await parent();
	if(!data.user) throw redirect(303, '/');
}