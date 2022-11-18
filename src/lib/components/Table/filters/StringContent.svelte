<script lang="ts">
	import { Input } from 'sveltestrap';
	import { getClmnCtx } from '../utils';
	export let value: string = '';
	export let beginsWith: boolean = false;
	export let caseSensitive: boolean = false;
	const setFilter = getClmnCtx().setFilter;
$:	setFilter(value ?
		((v: any)=> RegExp((beginsWith?'^':'')+<string>value, caseSensitive?'':'i').test(v)) :
		undefined);
</script>
<div class="th" scope="col">
	<Input type="search" bind:value />
</div>