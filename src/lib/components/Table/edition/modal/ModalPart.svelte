<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { setEdtnCtx, type Dialog, type Editing } from '../contexts';
	
	type T = $$Generic;

	export let
		dialog: Dialog,
		editing: Readable<Editing>;
	setEdtnCtx({
		dialog,
		editing
	});
</script>
<slot />