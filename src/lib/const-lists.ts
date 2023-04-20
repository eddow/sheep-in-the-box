export const languages = {
	en: 'English',
	fr: 'Français',
	ro: 'Română'
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
	},
	ctlg: {	// catalog
		icon: 'money bill',
		color: '#afb'
	}
} as const;

export const roles = ['adm', 'trad', 'dev', 'cms'] as const;