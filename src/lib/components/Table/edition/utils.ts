import type { Readable, Writable } from 'svelte/store';
import type { RowContext } from '../utils';
export type Dialog = 'body' | 'footer' | false;
export interface EditingRowContext<T=any> extends RowContext<T> {
	editing: Writable<any>;
	dialog: Dialog;
}

export interface EditionControl {
	modal: {
		opened: Readable<boolean>,
		close: ()=> void,
		add: (editing: Writable<any>)=> void,
		edit: (editing: Writable<any>, row: any, id?: string | number)=> void
	};
	rowCreation: {
		add(row: any): void,
		save(row: any, old: any): void,
		cancel(row: any): void,
		delete(row: any): void
	};
	editions: Map<any, Writable<any>>;
}

export function clone(o: any) {
	return JSON.parse(JSON.stringify(o));
}

export function compare(dst: any, src: any): any {
	let rv: any = null;
	function spec(k: string) {
		if(!rv) rv = {};
		rv[k] = dst[k];
	}
	for(const k in dst) if(!src.hasOwnProperty(k)) spec(k);
	for(const k in src)
		if(JSON.stringify(src[k]) !== JSON.stringify(dst[k]))
			spec(k);
	return rv;
}

export type Edition = 'dialog' | 'row' | 'both' | false;