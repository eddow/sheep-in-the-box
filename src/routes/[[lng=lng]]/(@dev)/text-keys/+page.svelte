<script lang="ts">
	import Edition from "$lib/components/Table/edition/Edition.svelte";
	import Text from "$lib/components/Table/edition/Text.svelte";
	import Table from "$lib/components/Table/edition/Table.svelte";
	import { debug } from "svelte/internal";
	
	const rows = [{
		key: 'cmd.test',
		text: 'Test me'
	}, {
		key: 'msg.test',
		text: 'Test done.'
	}];
	function save(e: CustomEvent) {
		debugger;
	}
	function remove(e: CustomEvent) {
		debugger;
	}
</script>
<Table data={rows}>
	<Text prop="key" title="Key" />
	<Text prop="text" title="Text" />
	<Edition on:save={save} on:remove={remove} />
</Table>