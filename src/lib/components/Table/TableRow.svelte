<script lang="ts">
	import { setRowCtx } from './utils'
	
	export let row: any;
	export let context: any = {};
	setRowCtx(context);
</script>
<div class="tr" {...$$restProps}>
	<slot {row} />
</div>