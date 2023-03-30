import { getArticle } from '$sitb/server/article';

export async function load({parent, params: {article}, locals: {language}}: any) {
	if(!article) article = 'home';
	const data = await parent(),
		articles = await getArticle(article, language);
	return {
		...data,
		...(articles.length ?{
			article: articles[0].text,
			title: articles[0].title
		} : {})
	};
}