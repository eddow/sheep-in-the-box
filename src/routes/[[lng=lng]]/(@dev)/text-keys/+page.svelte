<script lang="ts">
	import Edition from "$lib/components/Table/edition/Edition.svelte";
	import Text from "$lib/components/Table/edition/Text.svelte";
	import Table from "$lib/components/Table/edition/Table.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
	
	function save(e: CustomEvent) {
		debugger;
	}
	function remove(e: CustomEvent) {
		debugger;
	}
</script>
<Table data={data.dictionary}>
	<Text prop="key" title="Key" required />
	<Text prop="text" area title="Text" />
	<Edition on:save={save} on:remove={remove} />
</Table>