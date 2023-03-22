import { registration, userExists } from "$sitb/server/user";

export async function load({params}: Partial<Record<string, any>>) {
	const email = await registration(params.code);
	return {
		exists: email && await userExists(email)
	};
}