import { listUsers } from "$lib/server/user";

export async function load(event: Partial<Record<string, any>>) {
	return {
		users: await listUsers()
	};
}