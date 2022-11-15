<script context="module" lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import type { RowContext } from '../utils';
	export interface EditingContext extends RowContext {
		editing: Writable<boolean>;
	}
</script>
<script lang="ts">
	import TableRow from "../TableRow.svelte";

	export let row: any;
	export let id: string|number;
	const ctx = {editing: writable<boolean>(false)};
</script>
<TableRow {row} {id} {...$$props} context={ctx}>
	<slot />
</TableRow>