import { PUBLIC_GOOGLE_CLIENT_ID }  from "$env/static/public";
import {OAuth2Client} from "google-auth-library";
const client = new OAuth2Client();

export async function googleLogin(token: string) {
	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: PUBLIC_GOOGLE_CLIENT_ID
		});
		return ticket.getPayload()?.email;
	} catch (e) {
	}
}