import { editArticle } from "$sitb/server/article";

export async function load({params: {article}}: any) {
	if(!article) return {};
	return {article: editArticle(article)};
}