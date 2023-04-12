export type Language = 'en' | 'fr' | 'ro';
export const languages: Record<Language, string> = {
	en: 'English',
	fr: 'Français',
	ro: 'Română'
};

export const flags: Record<string, string> = {en: 'gb uk'};
export const flag = (lng: string) => (flags[lng] || lng);

export type Role = 'lgdn'|'adm'|'trad'|'sell'|'dev'|'cms';
export const roles = ['adm', 'trad', 'sell', 'dev', 'cms'];

export type Roles = Record<Role, boolean>;

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
export const textTypes = ['', 'tpl', 'html'];
export type TextType = '' | 'tpl' | 'html';

export interface ArticleTypeDesc {
	icon: string,
	color: string
}
export const articleTypes: Record<ArticleType, ArticleTypeDesc>  = {
	blog: {
		icon: 'rss',
		color: '#4ad'
	},
	sys: {	//system
		icon: 'cog',
		color: '#ccc'
	},
	rcp: {	// receipy
		icon: 'book',
		color: '#c58'
	},
	pres: {	// presentation
		icon: 'file image',
		color: '#dd8'
	},
	ctlg: {	// catalog
		icon: 'money bill',
		color: '#afb'
	}
};
export type ArticleType = 'blog'|'sys'|'rcp'|'pres'|'ctlg';