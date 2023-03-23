<script lang="ts">
	import Editor from './Editor.svelte'
	import { getClmnCtx, getRowCtx } from '../utils'
	import { Select, type DropdownOption } from 'svemantic';
	import type { EditingRowContext } from './utils';

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

	const { config } = getClmnCtx(),
		{ dialog } = getRowCtx<EditingRowContext>();
	let prop: string;
$:	prop = <string>$config.prop;
	export let
		multiple: boolean = false,
		options: DropdownOption[],
		delimiter: string = ',',
		value: string,
		textDelimiter: string = ', ';
</script>
<Editor {...$$restProps} {getDisplay} {value}>
	<Select class="collapsing" placeholder fluid={!!dialog} el={dialog ? 'div' : 'td'} {options} {multiple} name={prop} {delimiter} bind:value />
</Editor>