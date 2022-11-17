import Intl, { IntlKey } from "$lib/server/objects/intl";
import { map, removeIds } from "./db";
import User from "./objects/user";

const dictionary = map(Intl);
const keys = map(IntlKey);
const usersCl = map(User);

export async function allDB() : Promise<any> {
	let [intlkeys, intls, users] = <any[]>await Promise.all([
		keys.aggregate([{$project: {key: 1, role: 1, type: 1}}]),
		dictionary.aggregate([{$project: {key: 1, lng: 1, text: 1, ts: 1}}]),
		usersCl.aggregate([{$project: {email: 1, language: 1, password: 1, roles: 1}}])
	]);
	return {intlkeys: removeIds(intlkeys), intls: removeIds(intls), users: removeIds(users)};
}