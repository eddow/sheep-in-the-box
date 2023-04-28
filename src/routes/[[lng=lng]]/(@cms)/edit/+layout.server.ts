import { listArticles } from "$sitb/server/article";

export async function load(_: any) {
	return {list: await listArticles()};
}