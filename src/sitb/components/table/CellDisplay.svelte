<script lang="ts">
	import { getClmnCtx, getRowCtx, type RowContext } from './contexts'

	type T = $$Generic;
	const
		{ field, html, getDisplay: clmnDisplay } = getClmnCtx(),
		modelCtx = getRowCtx<RowContext<T>>(),
		model = modelCtx?.model;
	console.assert(field, 'Automatic display requires field name');
	export let getDisplay: (x: any, row: T)=> string = x=>x;
	let display: string, value: any;
	$: {
		value = $model[<keyof T>(field!.name)];
		display = clmnDisplay(getDisplay(value, $model), $model);
	}
</script>
<slot>
	{#if html && (html === true || html(value, $model))}
		{@html display}
	{:else}
		{display}
	{/if}
</slot>