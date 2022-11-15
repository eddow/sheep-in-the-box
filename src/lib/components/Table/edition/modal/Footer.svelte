<script lang="ts">
	import { ModalBody, ModalFooter } from 'sveltestrap';
	import { setRowCtx } from '../../utils'
	import type { Dialog } from '../TableRow.svelte';
	
	export let row: any;
	export let id: string|number;
	setRowCtx({row, id, dialog: 'footer'});
</script>
<ModalFooter>
	<slot />
</ModalFooter>