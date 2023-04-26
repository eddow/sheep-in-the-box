import type { Readable } from 'svelte/store';
import type { ItemEditionContext, TableEditionContext } from '../contexts';

export * from '../contexts';

export interface RowEditionContext<T=any> extends ItemEditionContext<T> {
	startEdit(): void;
	deleteRow(): void;
}

export interface AddableEditionContext<T=any> extends TableEditionContext<T> {
	add(model?: Partial<T>): void;
	endEdit(model: T, saved: boolean): void;
	added: Readable<Partial<T>[]>;
}