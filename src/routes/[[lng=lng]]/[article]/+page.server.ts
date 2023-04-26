import { articleTypes } from '$sitb/const-lists';
import { getArticle } from '$sitb/server/article';

export async function load({params: {article: slug}, locals: {language}}: any) {
	const article = await getArticle(slug, language, ['blog', 'rcp', 'pres', 'ctlg']);
	debugger;
	return {
		slug,
		// `ctlg`: if `role.cust`
		article
	};
}