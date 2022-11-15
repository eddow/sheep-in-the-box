export type Language = 'en' | 'fr' | 'ro';
export const languages: Record<string, string> = {
	en: 'English',
	fr: 'Français',
	ro: 'Română'
};

export type Role = 'adm' | 'trad' | 'sell' | 'dev';
export const roles = ['adm', 'trad', 'sell', 'dev'];