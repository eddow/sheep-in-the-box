import glob from 'fast-glob';

export default function nodules(type, fileName) {
	const name = 'nodules';//:'+type;
	return {
		name,
		config() {
			debugger;
		},
		setup(stuff) {
			debugger;
		},
		configureServer(server) {
			debugger;
		},
		configResolved(config) {
			debugger;
		},
		buildEnd() {
			debugger;
		}
	}
}