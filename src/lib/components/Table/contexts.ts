import { assertNnull } from '$sitb/utils';
import { setContext, getContext } from 'svelte';
import type { Readable } from 'svelte/store';
import type { FieldContext } from "svemantic";

const tableContextKey = Symbol('tableContext');
const rowContextKey = Symbol('rowContext');
const columnContextKey = Symbol('columnContext');
const cellContextKey = Symbol('cellContext');

export function setTblCtx<T extends Partial<TableContext> = TableContext>(c: T) { setContext(tableContextKey, c); }
export function getTblCtx<T extends Partial<TableContext> = TableContext>() { return assertNnull(getContext<T>(tableContextKey), 'Element in a table'); }
export function setRowCtx<T extends Partial<RowContext> = RowContext>(c: T) { setContext(rowContextKey, c); }
export function getRowCtx<T extends Partial<RowContext> = RowContext>() { return assertNnull(getContext<T>(rowContextKey), 'Element in a row'); }
export function setClmnCtx<T extends Partial<ColumnContext> = ColumnContext>(c: T) { setContext(columnContextKey, c); }
export function getClmnCtx<T extends Partial<ColumnContext> = ColumnContext>() { return assertNnull(getContext<T>(columnContextKey), 'Element in a column'); }
export function setCellCtx<T extends Partial<CellContext> = CellContext>(c: T) { setContext(cellContextKey, c); }
export function getCellCtx<T extends Partial<CellContext> = CellContext>() { return assertNnull(getContext<T>(cellContextKey), 'Element in a cell'); }

// Just unique objects
export const specialRow  = {
	header: <any>{},
	filter: <any>{},
	footer: <any>{}
}

export interface TableContext<T=any> {
	data: Readable<T[]>;
	setFilter(key: any, filter?: (model: T)=> boolean): void;
}

export interface RowContext<T=any> {
	model: Readable<T>;
}

export interface ColumnContext<T=any, F=any> {
	/** Individual cell controls */
	controls?: ConstructorOfATypedSvelteComponent
	/** Header column, like edition/selection/... */
	header?: boolean
	field: FieldContext;
	title: Readable<string>;
	setFilter(filter?: (value: F)=> boolean): void;
	html: ((x: F, model: T)=> boolean)|boolean;
	getDisplay(x: any, model: T): string;
}

export interface CellContext<F=any> {
	value: Readable<F>;
}
