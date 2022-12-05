<script lang="ts">
	import { setRowCtx } from '../utils'
	import type { EditingRowContext, Dialog } from './utils';
	
	export let dialog: Dialog;
	setRowCtx<EditingRowContext>({dialog});
</script>
<slot />