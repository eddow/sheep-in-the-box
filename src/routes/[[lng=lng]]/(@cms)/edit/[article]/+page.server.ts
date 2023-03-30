import { listTexts, listFiles } from "$sitb/server/article";

export async function load({params: {article}}: any) {
	if(!article) return {};
	const
		texts = listTexts(article),
		imgs = listFiles(article);
	return {texts, imgs};
}