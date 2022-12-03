import { assertNnull } from '$lib/utils';
import { getContext, setContext } from 'svelte';
import type { Readable } from 'svelte/store';
import type { ObjectShape, OptionalObjectSchema } from 'yup/lib/object';
import type { RowContext } from '../utils';

const editionContextKey = Symbol('editionContext');

export function setEdtnCtx<T extends EditionContext = EditionContext>(c: T) { setContext(editionContextKey, c); }
export function getEdtnCtx<T extends EditionContext = EditionContext>(): T {
	return assertNnull(getContext<T>(editionContextKey), 'Element in a form');
}

export enum Dialog { None = 0, Body, Footer }
export enum Editing { No = 0, Yes, Working }

export interface EditingRowContext<T=any> extends RowContext<T> {
	dialog: Dialog;
}

export interface EditionContext {
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