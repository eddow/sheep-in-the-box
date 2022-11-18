<script lang="ts">
	import { setRowCtx } from './utils'
  	import { exclude } from '../utils/exclude'
	import { useActions } from '../utils/useActions'
	
	export let row: any;
	export let id: string|number;
	export let use: any[] = [];
	export let context: any = {};
	Object.assign(context, {row, id})
	setRowCtx(context);
</script>
<tr data-row-id={''+id} use:useActions={use} {...exclude($$props, ['use', 'row', 'id'])}>
	<slot />
</tr>