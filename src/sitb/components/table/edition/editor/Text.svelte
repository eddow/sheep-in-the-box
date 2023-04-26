<script lang="ts">
	import { InputBase, type FieldContext, type InputType } from 'svemantic';
	import Editor from './Editor.svelte'
	import { getCellCtx, getClmnCtx } from '../contexts'

	type T = $$Generic;

	const
		field = <FieldContext<T>>getClmnCtx().field,
		{ value } = getCellCtx();
	console.assert(field, 'Automatic edition requires field name');
	export let
		autofocus: boolean = false,
		placeholder: string | undefined = undefined,
		type: InputType = 'text';
</script>
<Editor {...$$restProps}>
	<InputBase {placeholder} {autofocus} {type} name={field.name} value={$value||''} />
</Editor>