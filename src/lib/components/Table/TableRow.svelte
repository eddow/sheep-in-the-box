<script lang="ts">
	import { privateStore } from '$sitb/privateStore';
	import { Tr } from 'svemantic';
	import { setRowCtx } from './contexts'
	
	type T = $$Generic;
	export let
		model: T,
		context: any = {};
	const modelPrv = privateStore<T>(model);
	$: modelPrv.value = model;
	setRowCtx({model: modelPrv.store, ...context});
</script>
<Tr {...$$restProps}>
	<slot {model} />
</Tr>