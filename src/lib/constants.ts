export type Language = 'en' | 'fr' | 'ro';
export const languages: Record<string, string> = {
	en: 'English',
	fr: 'Français',
	ro: 'Română'
};

export type Role = 'adm' | 'trad' | 'sell' | 'dev';
export const roles = ['adm', 'trad', 'sell', 'dev'];

export interface Roles {
	adm: boolean;
	trad: boolean;
	sell: boolean;
	dev: boolean;
}

export const textTypes = ['txt', 'tpl', 'html', 'md'];
export type TextType = 'txt' | 'tpl' | 'html' | 'md';