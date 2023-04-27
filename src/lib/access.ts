import type { ArticleType, Role } from "$sitb/constants";

export function articleAccess(type: ArticleType, role: Role): boolean {
	return true;// type !== 'ctlg' || role in ['cms', 'cust'];
}