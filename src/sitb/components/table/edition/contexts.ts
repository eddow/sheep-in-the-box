export * from '../contexts';
import { assertNnull } from '$sitb/utils';
import { type ComponentType, getContext, setContext } from 'svelte';
import type { Readable } from 'svelte/store';
import type { TableContext } from '../contexts';

export * from '../contexts';

export type Editing = boolean|'working';
export type Dialog = false|'body'|'actions';

const itmEditionContextKey = Symbol('itmEditionContext');

export function setEdtnCtx<T extends Partial<ItemEditionContext> = ItemEditionContext>(c: T) { setContext(itmEditionContextKey, c); }
export function getEdtnCtx<T extends Partial<ItemEditionContext> = ItemEditionContext>(): T {
	return assertNnull(getContext<T>(itmEditionContextKey), 'Element in an editable context');
}

export interface ItemEditionContext<T=any> {
	editing: Readable<boolean|'working'>;
	dialog: Dialog;	// The dialog status has to be known at this level as both row and column -edition use them
	form?(...parms: any[]): any;
	actions?: ComponentType;
};

export interface TableEditionContext<T=any> extends TableContext {
	deletable: boolean;
	save(old: T, diff: Partial<T>): Promise<void>;
	deleteRow(model: T): Promise<false|undefined>;
	editModal(model: Partial<T>): void;
}
