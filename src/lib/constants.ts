export type Language = 'en' | 'fr' | 'ro';
export const languages: Record<string, string> = {
	en: 'English',
	fr: 'Français',
	ro: 'Română'
};

export const flags: Record<string, string> = {en: 'gb uk'};
export const flag = (lng: string) => (flags[lng] || lng);

export type Role = 'adm' | 'trad' | 'sell' | 'dev' | 'lgdn';
export const roles = ['adm', 'trad', 'sell', 'dev'];

export type Roles = Record<Role, boolean>;

export interface User {
	email: string;
	roles: Roles;
	language: Language;
	preferences: any;
}

export interface UserSys {
	email: string;
	roles: string;
	language: Language;
	preferences: any;
}
export const textTypes = ['', 'tpl', 'html', 'md'];
export type TextType = '' | 'tpl' | 'html' | 'md';