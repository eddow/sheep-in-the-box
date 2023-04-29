<script lang="ts">
	import type { RowModel } from './Table.svelte';
	import { Tr } from 'svemantic';
	
	type T = $$Generic;
	export let
		model: RowModel<T>;
</script>
<Tr {...$$restProps}>
	<slot {model} />
</Tr>