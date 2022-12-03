<script lang="ts">
	import { setRowCtx } from '../utils'
	import type { EditingRowContext, Dialog } from './utils';
	
	export let row: any;
	export let key: string;
	export let dialog: Dialog;
	setRowCtx<EditingRowContext>({row, id: row[key], dialog});
</script>
<slot />