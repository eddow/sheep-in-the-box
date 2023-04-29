<script lang="ts">
	import { Cell } from "svemantic";
	import Column from "../../Column.svelte";
	import { getEdtnCtx } from "../contexts";
	import type { ComponentProps } from "svelte";

	type T = $$Generic;
	type keyT = string & keyof T;
	const ColumnT = Column<T>;

	interface $$Props extends ComponentProps<Column<T>> {}

	const
		{ editing, dialog } = getEdtnCtx();

	export let
		name: keyT|undefined = undefined,
		header: boolean = false;
	let cs: string;
	$: cs = $editing ? 'editor' : '';
</script>
<ColumnT {name} {header} let:title {...$$restProps} let:model>
	<slot name="filter" slot="filter"><th></th></slot>
	<slot name="header" slot="header"><th scope="col">{title}</th></slot>
	<slot name="footer" slot="footer"><th scope="col" /></slot>
	{#if dialog}
		<slot {title} />
	{:else}
		<Cell {header} scope="row" class={cs}>
			<slot {title} {model} />
		</Cell>
	{/if}
</ColumnT>