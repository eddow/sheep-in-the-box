<script lang="ts">
	import { setRowCtx } from './contexts';
	import { privateStore } from '$sitb/stores/privateStore';
	import { Tr } from 'svemantic';
	
	type T = $$Generic;
	export let model: T|symbol;

	const modelPrv = privateStore<T|symbol>();
	$: modelPrv.value = model;
	setRowCtx<T|symbol>(modelPrv.store);
</script>
<Tr {...$$restProps}>
	<slot {model} />
</Tr>