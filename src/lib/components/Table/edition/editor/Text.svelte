<script lang="ts">
	import { InputBase, type InputType } from 'svemantic';
	import Editor from './Editor.svelte'
	import { getCellCtx, getClmnCtx } from '../contexts'

	const
		{ field } = getClmnCtx(),
		{ value } = getCellCtx();
		
	export let
		autofocus: boolean = false,
		placeholder: string | undefined = undefined,
		type: InputType = 'text';
</script>
<Editor {...$$restProps}>
	<InputBase {placeholder} {autofocus} {type} name={$field.name} value={$value||''} />
</Editor>