import { assertNnull } from '$lib/utils';
import {setContext, getContext, tick} from 'svelte';
import type {Readable, Writable} from 'svelte/store';

const tableContextKey = Symbol('tableContext');
const rowContextKey = Symbol('rowContext');
const columnContextKey = Symbol('columnContext');
// Just unique objects
export const specialRow  = {
	header: <any>{},
	filter: <any>{},
	footer: <any>{}
}

export interface TableContext<T=any> {
	data: Readable<T[]>;
	setFilter(key: any, filter?: (row: T)=> boolean): void;
}
export interface RowContext<T=any> {
}
export interface ColumnContext<T=any> {
	setFilter(filter?: (value: T)=> boolean): void;
	config: Writable<{
		value?: T,
		prop?: string,
		title?: string,
		headers?: boolean,
		html?: boolean
	}>;
}

export function setTblCtx<T extends TableContext = TableContext>(c: T) { setContext(tableContextKey, c); }
export function getTblCtx<T extends TableContext = TableContext>() { return assertNnull(getContext<T>(tableContextKey), 'Element in a table'); }
export function setRowCtx<T extends RowContext = RowContext>(c: T) { setContext(rowContextKey, c); }
export function getRowCtx<T extends RowContext = RowContext>() { return assertNnull(getContext<T>(rowContextKey), 'Element in a row'); }
export function setClmnCtx<T extends ColumnContext = ColumnContext>(c: T) { setContext(columnContextKey, c); }
export function getClmnCtx<T extends ColumnContext = ColumnContext>() { return assertNnull(getContext<T>(columnContextKey), 'Element in a column'); }
