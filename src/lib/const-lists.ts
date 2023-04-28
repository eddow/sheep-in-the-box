export const languages = {
	en: {
		code: 'en-GB',
		text: 'English'
	},
	fr: {
		code: 'fr-FR',
		text: 'Français'
	},
	ro: {
		code: 'ro-RO',
		text: 'Română'
	}
} as const;

export const articleTypes = {
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
	}
} as const;

export const roles = ['adm', 'trad', 'dev', 'cms'] as const;
