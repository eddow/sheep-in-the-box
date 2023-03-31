<script lang="ts">
	import Editor from './Editor.svelte'
	import { Field, Input, Select, type DropdownOption, type RulesSpec } from 'svemantic';
	import { getCellCtx, getClmnCtx, getEdtnCtx, getRowCtx, type RowContext } from '../contexts';

// TODO: multiple
	function itmDisplay(value: string) {
		const itm = options.find(o=> o.value === value);
		return itm?.display || itm?.text || value;
	}
	function getDisplay(value: string|string[]) {
		if(!multiple) return itmDisplay(<string>value);
		if(typeof value === 'string') value = value.split(delimiter);
		return value.map(itmDisplay).join(textDelimiter);
	}

	const { field } = getClmnCtx(),
		{ value } = getCellCtx();
		
	export let
		multiple: boolean = false,
		options: DropdownOption[],
		delimiter: string = ',',
		textDelimiter: string = ', ',
		placeholder: string | undefined = undefined;
</script>
<Editor {...$$restProps} {getDisplay}>
	<Select class="collapsing" {placeholder} fluid {options} {multiple} name={$field.name} {delimiter} value={$value} />
</Editor>