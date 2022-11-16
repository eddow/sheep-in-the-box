<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { setRowCtx } from '../utils'
	import type { EditingRowContext, Dialog } from './utils';
	
	export let row: any;
	export let id: string | number | undefined = undefined;
	export let dialog: Dialog;
	export let editing: Writable<any>;
	setRowCtx<EditingRowContext>({row, id, dialog, editing});
</script>
<slot />