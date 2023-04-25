import { articleTypes } from '$sitb/const-lists';
import { getArticle } from '$sitb/server/article';

export async function load({params: {article: slug}, locals: {language}}: any) {
	return {
		slug,
		// `ctlg`: if `role.cust`
		article: await getArticle(slug, language, ['blog', 'rcp', 'pres', 'ctlg'])
	};
}