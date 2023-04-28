import { articleAccess } from '$lib/articles';
import { articleTypes } from '$sitb/const-lists';
import type { ArticleType } from '$sitb/constants';
import { getArticle } from '$sitb/server/article';
import { analyseRoles } from '$sitb/user';

export async function load({params: {article: slug}, locals: {language, user}}: any) {
	return {
		article: await getArticle(slug, language, <ArticleType[]>Object.keys(articleTypes).filter(
			(type) => type !== 'sys' && articleAccess(<ArticleType>type, analyseRoles(user?.roles))))
	};
}