<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Editor from './Editor.svelte'
	import { Select, type DropdownOption, type RulesSpec, type FieldContext } from 'svemantic';
	import { getClmnCtx } from '../contexts';

	type T = $$Generic;
	interface $$Props extends ComponentProps<Editor<T>> {
		options: DropdownOption[],
		multiple?: boolean,
		delimiter?: string,
		textDelimiter?: string,
		placeholder?: string,
		model: T,
		value?: string | string[] | undefined,
	}

	function itmDisplay(value: string) {
		const itm = options.find(o=> o.value === value);
		return itm?.display || itm?.text || value;
	}
	function getDisplay(value: string|string[]) {
		if(!multiple) return itmDisplay(<string>value);
		if(!value) return '';
		if(typeof value === 'string') value = value.split(delimiter);
		return value.map(itmDisplay).join(textDelimiter);
	}

	const
		EditorT = Editor<T>,
		field = <FieldContext<T>>getClmnCtx().field!;
		
	console.assert(field, 'Automatic edition requires field name');
	export let
		multiple: boolean = false,
		options: DropdownOption[],
		delimiter: string = ',',
		textDelimiter: string = ', ',
		placeholder: string | undefined = undefined,
		model: T,
		value: string | string[] | undefined = '';
	$: value = <string|string[]|undefined>model[<keyof T>field.name];
</script>
<EditorT {model} {...$$restProps} {getDisplay}>
	<Select class="collapsing" {placeholder} fluid {options} {multiple} name={field.name} {delimiter} {value} />
</EditorT>