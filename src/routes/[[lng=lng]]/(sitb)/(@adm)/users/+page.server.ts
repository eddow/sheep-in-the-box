import { listUsers } from "$sitb/server/user";

export async function load(event: Partial<Record<string, any>>) {
	return {
		users: await listUsers()
	};
}