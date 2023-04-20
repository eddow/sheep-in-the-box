import { articleTypes, languages, roles } from "$lib/const-lists";
export { articleTypes, languages, roles };

export type Language = keyof typeof languages;
export const flags: Record<string, string> = {en: 'gb uk'};
export const flag = (lng: string) => (flags[lng] || lng);

export type Role = typeof roles[number];
export type Roles = Record<Role, boolean>;

export const textTypes = ['', 'tpl', 'html'] as const;
export type TextType = typeof textTypes[number];
export interface User {
	email: string;
	roles: Roles;
	language: Language;
	preferences: any;
}

export interface UserSys {
	_id: string;
	email: string;
	roles: string;
	language: Language;
	preferences: any;
}

export interface ArticleTypeDesc {
	icon: string,
	color: string
}
export type ArticleType = keyof typeof articleTypes;