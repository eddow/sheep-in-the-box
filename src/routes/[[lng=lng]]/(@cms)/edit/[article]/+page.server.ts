import { listTexts } from "$sitb/server/article";

export async function load({parent, params: {article}}: any) {
	if(!article) return {};
	const texts = listTexts(article);
	return {texts};
}