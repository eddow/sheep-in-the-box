import { registration, userExists } from "$lib/server/auth";

export const load = async (event: Partial<Record<string, any>>) => {
	const email = await registration(event.params.code);
// TODO Check timestamp
	return {
		code: event.params.code,
		email,
		exists: email && await userExists(email)
	};
}