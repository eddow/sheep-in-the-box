import type { ArticleType, Roles } from "$sitb/constants";

export function articleAccess(type: ArticleType, roles: Roles): boolean {
	return type !== 'ctlg' || roles.cms || roles.cust;
}