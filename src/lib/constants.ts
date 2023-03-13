export type Language = 'en' | 'fr' | 'ro';
export const languages: Record<string, string> = {
	en: 'English',
	fr: 'Français',
	ro: 'Română'
};

const mods: Record<string, string> = {en: 'gb'};
export const flag = (lng: string) => 'fi fi-'+(mods[lng] || lng);

export type Role = 'adm' | 'trad' | 'sell' | 'dev' | 'lgdn';
export const roles = ['adm', 'trad', 'sell', 'dev'];

export interface Roles {
	adm: boolean;
	trad: boolean;
	sell: boolean;
	dev: boolean;
	lgdn: boolean;
}

export interface User {
	email: string;
	roles: string | Roles;
	language: Language;
	preferences: any;
}

export const textTypes = ['', 'tpl', 'html', 'md'];
export type TextType = '' | 'tpl' | 'html' | 'md';