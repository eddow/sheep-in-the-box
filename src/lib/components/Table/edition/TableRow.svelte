<script lang="ts">
	import { getContext } from "svelte";
	import { writable } from "svelte/store";
	import TableRow from "../TableRow.svelte";
	import type { EditionControl } from "./utils";

	export let row: any;
	export let id: string|number;
	const {editions} = getContext<EditionControl>('edition');
	const ctx = {editing: editions.get(row) || writable<any>(null), dialog: false};
</script>
<TableRow {row} {id} {...$$props} context={ctx}>
	<slot />
</TableRow>