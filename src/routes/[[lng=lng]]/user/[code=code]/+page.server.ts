import { registration, userExists } from "$sitb/server/user";

export async function load({params: {code}}: any) {
	const email = await registration(code);
	return {
		exists: email && await userExists(email)
	};
}