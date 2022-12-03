import type { Readable } from 'svelte/store';
import type { ObjectShape, OptionalObjectSchema } from 'yup/lib/object';
import type { RowContext } from '../utils';

export enum Dialog { None = 0, Body, Footer }
export enum Editing { No = 0, Yes, Working }

export interface EditingRowContext<T=any> extends RowContext<T> {
	dialog: Dialog;
}

export interface EditionControl {
	editing: Readable<Editing>;
	startEdit?: ()=> void;
	save: (row: any, old: any)=> Promise<boolean>
	cancelEdit(row?: any): void;
	deleteRow(row?: any): void;
	addRow(row?: any): void;
	editModal(row: any): void;
	addedRows: Set<any>;
	schema: OptionalObjectSchema<ObjectShape>;
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
	for(const k in dst) if(!(k in src)) spec(k);
	for(const k in src)
		if(JSON.stringify(src[k]) !== JSON.stringify(dst[k]))
			spec(k);
	return rv;
}

export type Edition = 'dialog' | 'row' | 'both' | false;