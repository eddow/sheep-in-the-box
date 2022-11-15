<script lang="ts">
	import { enhance } from '$app/forms';
	import { ModalBody } from 'sveltestrap';
	import { setRowCtx } from '../../utils'
	
	export let row: any;
	export let id: string|number;
	setRowCtx({row, id, dialog: 'body'});
</script>
<ModalBody>
	<slot />
</ModalBody>