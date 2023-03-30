import { listArticles } from "$sitb/server/article";

export async function load({parent, locals: {language}}: any) {
	const data = await parent(),
		list = await listArticles(language);
	return {...data, list};
}