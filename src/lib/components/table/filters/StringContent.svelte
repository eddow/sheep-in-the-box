<script lang="ts">
	import { Input, Th } from 'svemantic';
	import { getClmnCtx } from '../contexts';
	export let value: string = '';
	export let beginsWith: boolean = false;
	export let caseSensitive: boolean = false;
	const setFilter = getClmnCtx().setFilter;
$:	setFilter(value ?
		((v: any)=> RegExp((beginsWith?'^':'')+<string>value, caseSensitive?'':'i').test(v||'')) :
		undefined);
</script>
<th class="string-filter" scope="col">
	<Input fluid type="search" bind:value left-icon="search" />
</th>
<style lang="scss" global>
	th.string-filter {
		min-width: 9em;	// Filtering can return an empty row who makes filters unusable as they collapse without width
	}
</style>