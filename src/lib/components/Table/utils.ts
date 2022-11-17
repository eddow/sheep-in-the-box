import {setContext, getContext} from 'svelte';
import type {Readable, Writable} from 'svelte/store';

const tableContextKey = {};
const rowContextKey = {};
const columnContextKey = {};
export enum specialRow {
	header = 'headerRow',
	filter = 'filterRow',
	footer = 'footerRow'
}
export type RowContent<T=any> = specialRow|T;
export interface TableContext<T=any> {
	data: Readable<T[]>;
	setFilter(key: any, filter?: (row: T)=> boolean): void;
}
export interface RowContext<T=any> {
	row: T;
	id?: string | number;
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
export function setTblCtx<T=TableContext>(c: T) { setContext(tableContextKey, c); }
export function getTblCtx<T=TableContext>() { return <T>getContext(tableContextKey); }
export function setRowCtx<T=RowContext>(c: T) { setContext(rowContextKey, c); }
export function getRowCtx<T=RowContext>() { return <T>getContext(rowContextKey); }
export function setClmnCtx<T=ColumnContext>(c: T) { setContext(columnContextKey, c); }
export function getClmnCtx<T=ColumnContext>() { return <T>getContext(columnContextKey); }