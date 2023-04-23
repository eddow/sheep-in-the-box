import { articleTypes, languages, roles } from "$lib/const-lists";
export { articleTypes, languages, roles };

export type Language = keyof typeof languages;
export type LanguageDesc = typeof languages[Language];
// All international defaults (to complete without fear of interfering on the end-application)
export const flags: Record<string, string> = {'en-GB': 'gb uk', 'en-US': 'us'};
export const flag = (lng: Language) => (flags[languages[lng].code] || lng);

export type Role = 'lgdn' | typeof roles[number];
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

export type ArticleType = keyof typeof articleTypes;
export type ArticleTypeDesc = typeof articleTypes[ArticleType];