import { getArticle } from '$sitb/server/article';

export async function load({locals: {language}}: any) {
	return getArticle('home', language, ['sys']);
}