import { getArticle } from '$sitb/server/article';

export async function load({locals: {language}}: any) {
	const articles = await getArticle('home', language);
	return articles ? {
			article: articles.text,
			title: articles.title
		} : {};
}