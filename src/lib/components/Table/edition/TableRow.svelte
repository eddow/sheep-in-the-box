<script context="module" lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import type { RowContext } from '../utils';
	export type Dialog = 'body' | 'footer' | false;
	export interface EditingRowContext<T=any> extends RowContext<T> {
		editing: Writable<boolean>;
		dialog: Dialog;
	}
</script>
<script lang="ts">
	import TableRow from "../TableRow.svelte";

	export let row: any;
	export let id: string|number;
	const ctx = {editing: writable<boolean>(false), dialog: false};
</script>
<TableRow {row} {id} {...$$props} context={ctx}>
	<slot />
</TableRow>