import { registration, userExists } from "$lib/server/user";

export const load = async (event: Partial<Record<string, any>>) => {
	const email = await registration(event.params.code);
	return {
		exists: email && await userExists(email)
	};
}