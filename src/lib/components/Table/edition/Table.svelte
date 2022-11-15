<script lang="ts">
	import TableRow from "./TableRow.svelte";
	import Table from "../Table.svelte";

	export let data: any[];
</script>
<Table {data} {...$$props} rowType={TableRow}>
	<slot />
</Table>