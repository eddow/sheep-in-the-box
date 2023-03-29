import { writable, type Writable } from "svelte/store";

interface Preference extends Writable<string|undefined> {
	forward: (v: string)=> void;
};

export enum Side {
	client, server
}

export interface ops {
	get(name: string): string | undefined;
	set(side: Side, name: string, value: string): void;
	del(side: Side, name: string): void;
}

const allPrefs: Record<string, Preference> = {};
let operations: ops = {get: ()=> undefined, set: ()=> undefined, del: ()=> undefined};

export function setPrefOperations(nwOps: ops, values: Record<string, string>) {
	operations = nwOps;
	if(values) for(const pi in allPrefs) {
		allPrefs[pi].forward(values[pi]);
	}
}
export function preference(name: string, side: Side = Side.client, dft?: string) : Writable<string|undefined> {
	if(!allPrefs[name]) {
		const prefDef = writable<string|undefined>(operations.get(name) || dft, ()=> (()=> { delete allPrefs[name]; }));
		allPrefs[name] = Object.create(prefDef, {
			forward: {value: (v: string)=> prefDef.set(v || dft)},
			set: {value: (v?: string)=> {
				if(!v) v = dft;
				prefDef.set(v);
				if(v === undefined) operations.del(side, name);
				else operations.set(side, name, v);
			}}
		});
	}
	return allPrefs[name];
}