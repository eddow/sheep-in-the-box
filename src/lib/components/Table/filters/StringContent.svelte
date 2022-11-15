<script lang="ts">
	import {getClmnCtx} from '../utils'
	export let value: string = '';
	export let beginsWith: boolean = false;
	export let caseSensitive: boolean = false;
	const setFilter = getClmnCtx().setFilter;
$:	setFilter(value ?
		((v: any)=> RegExp((beginsWith?'^':'')+<string>value, caseSensitive?'':'i').test(v)) :
		undefined);
</script>
<template>
	<input type="text" bind:value />
</template>