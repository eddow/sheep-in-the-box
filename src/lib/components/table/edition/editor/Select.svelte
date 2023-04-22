<script lang="ts">
	import Editor from './Editor.svelte'
	import { Select, type DropdownOption, type RulesSpec, type FieldContext } from 'svemantic';
	import { getCellCtx, getClmnCtx, getEdtnCtx, getRowCtx, type RowContext } from '../contexts';

	type T = $$Generic;

	function itmDisplay(value: string) {
		const itm = options.find(o=> o.value === value);
		return itm?.display || itm?.text || value;
	}
	function getDisplay(value: string|string[]) {
		if(!multiple) return itmDisplay(<string>value);
		if(typeof value === 'string') value = value.split(delimiter);
		return value.map(itmDisplay).join(textDelimiter);
	}

	const
		field = <FieldContext<T>>getClmnCtx().field,
		{ value } = getCellCtx();
		
	console.assert(field, 'Automatic edition requires field name');
	export let
		multiple: boolean = false,
		options: DropdownOption[],
		delimiter: string = ',',
		textDelimiter: string = ', ',
		placeholder: string | undefined = undefined;
</script>
<Editor {...$$restProps} {getDisplay}>
	<Select class="collapsing" {placeholder} fluid {options} {multiple} name={field.name} {delimiter} value={$value} />
</Editor>