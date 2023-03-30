import { getArticle } from '$sitb/server/article';

export async function load({parent, params: {article}, locals: {language}}: any) {
	const data = await parent(),
		articles = await getArticle(article, language);
	return {
		...data,
		...(articles ? {
			article: articles.text,
			title: articles.title
		} : {})
	};
}