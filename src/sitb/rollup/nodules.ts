import glob from 'fast-glob';

const types = {
	menu: '+menu.svelte',
	server: '+server.ts',
	socket: '+socket.ts'
} as const;
type NoduleType = keyof typeof types;
export default {
	name: 'nodules',
	resolveId: (id: string) => {
		if (id === 'nodules') {
			return id;
		}
	},
	load: async (id: string) => {
		if (id === 'nodules') {
			const rv: Record<NoduleType, string[]> = {menu: <string[]>[], server: <string[]>[], socket: <string[]>[]};
			for(const type in types)
				for (const path of await glob('./nodules/**/+')) {
					debugger;
					rv[<NoduleType>type].push(path);
				}
			return `export default ${JSON.stringify(rv, undefined, '\t')}`;
		}
	}
}