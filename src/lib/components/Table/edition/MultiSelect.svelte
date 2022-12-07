<script lang="ts">
	import MultiSelect, { type Option } from '$lib/components/form/MultiSelect.svelte';
	import Editor from './Editor.svelte'
	import { getClmnCtx } from '../utils'
	import SlotFragment from '$lib/components/SlotFragment.svelte';

	const { config } = getClmnCtx();
	export let options: Option[] = [];
	let prop: string;
$:	prop = <string>$config.prop;
	export let placeholder: string | undefined = undefined;
	export let value: string;
	export let selected: Option[] = [];
	// several item values to one ms-value
	export let listValue: (vs: string[])=> string = (vs: string[])=> vs.join(' ');
	// one ms-value to several item value
	export let readValue: (v: string)=> string[] = (v: string)=> v.split(' ');
	// one item value to one item display
	export let displayValue: (v:string)=> string = v=> options.find(o=> o.value == v)?.text || value;
	// several item displays to one ms-display
	export let listDisplay: (ds: string[])=> string = ds=> ds.join(', ');
	function getDisplay(v: string) {
		return listDisplay(readValue(v).map(displayValue));
	}
</script>
<Editor {...$$restProps} {getDisplay} {value}>
	<MultiSelect {placeholder} bind:selected bind:value name={prop} {options} {listValue} {readValue}>
		{#if $$slots.option}
			<SlotFragment slot="option" let:selected let:option>
				<slot name="option" {selected} {option} />
			</SlotFragment>
		{/if}
	</MultiSelect>
</Editor>