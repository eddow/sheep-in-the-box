<script lang="ts">
	import { privateStore } from '$sitb/privateStore';
	import { Tr } from 'svemantic';
	import { setRowCtx } from './utils'
	
	type T = $$Generic;
	export let
		row: T,
		context: any = {};
	const rowStore = privateStore<T>(row);
	$: rowStore.value = row;
	setRowCtx({row: rowStore.store, ...context});
</script>
<Tr {...$$restProps}>
	<slot {row} />
</Tr>