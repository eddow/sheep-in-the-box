import type { ArticleType, Roles } from "$sitb/constants";

export function articleAccess(type: ArticleType, roles: Roles): boolean {
	return true;
}

export const typeComponents: Partial<Record<ArticleType, ConstructorOfATypedSvelteComponent>> = {};