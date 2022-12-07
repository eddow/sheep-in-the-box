import { listUsers } from "$lib/server/user";

export const load = async ({locals}: Partial<Record<string, any>>) => {
	return {
		users: await listUsers()
	};
}