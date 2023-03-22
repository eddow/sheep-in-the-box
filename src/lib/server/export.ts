import Intl, { IntlKey } from "$sitb/server/objects/intl";
import { map } from "./db";
import User from "./objects/user";

const dictionary = map(Intl);
const keys = map(IntlKey);
const usersCl = map(User);

export async function allDB() : Promise<any> {
	let [intlkeys, intls, users] = <any[]>await Promise.all([
		keys.aggregate([{$project: {_id: 0, key: 1, role: 1, type: 1}}]),
		dictionary.aggregate([{$project: {_id: 0, key: 1, lng: 1, text: 1, ts: 1}}]),
		usersCl.aggregate([{$project: {_id: 0, email: 1, language: 1, password: 1, roles: 1, preferences: 1}}])
	]);
	return {intlkeys, intls, users};
}