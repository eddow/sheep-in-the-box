<script lang="ts">
	import { setRowCtx } from './utils'
	
	export let row: any;
	export let id: string|number;
	export let context: any = {};
	Object.assign(context, {row, id})
	setRowCtx(context);
</script>
<div class="tr" data-row-id={''+id} {...$$restProps}>
	<slot />
</div>