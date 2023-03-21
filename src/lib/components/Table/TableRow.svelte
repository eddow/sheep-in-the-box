<script lang="ts">
	import { Tr } from 'svemantic';
	import { setRowCtx } from './utils'
	
	type T = $$Generic;
	export let row: T;
	export let context: any = {};
	setRowCtx({row, ...context});
</script>
<Tr {...$$restProps}>
	<slot {row} />
</Tr>