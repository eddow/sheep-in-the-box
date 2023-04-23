import { getArticle } from '$sitb/server/article';

export async function load({params: {article: slug}, locals: {language}}: any) {
	return {
		slug,
		article: await getArticle(slug, language)
	};
}