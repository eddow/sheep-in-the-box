import { assertNnull } from '$lib/utils';
import { getContext, setContext } from 'svelte';
import type { Readable } from 'svelte/store';
import type { ObjectShape, OptionalObjectSchema } from 'yup/lib/object';
import type { RowContext, TableContext } from '../utils';

const editionContextKey = Symbol('editionContext');

export function setEdtnCtx<T extends EditionContext = EditionContext>(c: T) { setContext(editionContextKey, c); }
export function getEdtnCtx<T extends EditionContext = EditionContext>(): T {
	return assertNnull(getContext<T>(editionContextKey), 'Element in an editable context');
}

export enum Dialog {
	None = 0,		// In a row-edit row
	Body, Footer,	// In a dialog
	Wrapped			// In a `td` already
}
export enum Editing { No = 0, Yes, Working }

export interface EditingRowContext<T=any> extends RowContext<T> {
	dialog: Dialog;
}

export interface EditingTableContext<T=any> extends TableContext<T> {
	deletable: boolean;
}

export interface EditionContext {
	editing: Readable<Editing>;
	schema?: OptionalObjectSchema<ObjectShape>;	//TODO remove after -> semantic
}

export interface RowEditionContext extends EditionContext {
	startEdit?: ()=> void;
	save: (row: any, old: any)=> Promise<boolean>
	cancelEdit(row?: any): void;
	deleteRow(row?: any): void;
	addRow(row?: any): void;
	editModal(row: any): void;
	addedRows: Set<any>;
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