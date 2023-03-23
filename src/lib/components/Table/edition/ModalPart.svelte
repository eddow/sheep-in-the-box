<script lang="ts">
	import { privateStore } from '$sitb/privateStore';
	import { setRowCtx } from '../utils'
	import type { EditingRowContext, Dialog } from './utils';
	
	type T = $$Generic;

	export let dialog: Dialog, row: T;
	const rowStore = privateStore<T>(row);
	$: rowStore.value = row;
	setRowCtx<EditingRowContext>({row: rowStore.store, dialog});
</script>
<slot />