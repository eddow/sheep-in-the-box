<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Editor from './Editor.svelte'
	import { Checkbox, Icon } from 'svemantic';
	import { type ColumnContext, getClmnCtx, getEdtnCtx, getRowCtx } from '../contexts';

	type T = $$Generic;
	interface $$Props extends ComponentProps<Editor<T>> {}
	
	const
		{ dialog } = getEdtnCtx();
	const
		EditorT = Editor<T>,
		{ field, title } = getClmnCtx<ColumnContext<T>>(),
		{ name } = field || {name: ''},
		model = getRowCtx<T>();
	console.assert(field, 'Automatic edition requires field name');
	let value: boolean;
	$: value = <boolean>$model?.[<keyof T>field!.name];
// TODO always editable in cell-edit -> no ' Editor'
// TODO Not even tested/used
</script>
<EditorT {...$$restProps}>
	<Icon slot="display" icon={value?'check':'times'} />
	<Checkbox {value} {name} label={dialog?$title:''} />
</EditorT>