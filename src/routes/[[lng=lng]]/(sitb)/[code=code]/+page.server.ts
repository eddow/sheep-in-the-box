import { registration, userExists } from "$sitb/server/user";

export async function load({params: {code}}: any) {
	const reg = await registration(code);
	return {
		exists: reg && await userExists(reg.email)
	};
}