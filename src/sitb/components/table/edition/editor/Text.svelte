<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { InputBase, type InputType } from 'svemantic';
	import Editor from './Editor.svelte'
	import { type ColumnContext, getClmnCtx, getRowCtx } from '../contexts'

	type T = $$Generic;
	interface $$Props extends ComponentProps<Editor<T>> {
		autofocus?: boolean;
		placeholder?: string;
		type?: InputType;
	}

	const
		EditorT = Editor<T>,
		field = getClmnCtx<ColumnContext<T>>().field!,
		model = getRowCtx<T>();
	console.assert(field, 'Automatic edition requires field name');
	export let
		autofocus: boolean = false,
		placeholder: string | undefined = undefined,
		type: InputType = 'text';
	let value: string;
	$: value = <string>$model?.[<keyof T>field.name] || '';
</script>
<EditorT {...$$restProps}>
	<InputBase {placeholder} {autofocus} {type} name={field.name} {value} />
</EditorT>