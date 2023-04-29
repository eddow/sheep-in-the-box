<script lang="ts">
	import { type ColumnContext, getClmnCtx } from './contexts'

	type T = $$Generic;
	const
		{ field, html, getDisplay: clmnDisplay } = getClmnCtx<ColumnContext<T>>();
	console.assert(field, 'Automatic display requires field name');
	export let getDisplay: (x: any, model: T)=> string = x=>x,
		model: T;
	let display: string, value: any;
	$: {
		value = model[<keyof T>field!.name];
		display = clmnDisplay(getDisplay(value, model), model);
	}
</script>
<slot>
	{#if html && (html === true || html(value, model))}
		{@html display}
	{:else}
		{display}
	{/if}
</slot>