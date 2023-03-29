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
		{ editing } = getEdtnCtx();

	export let
		name: keyT|undefined = undefined,
		header: boolean = false;
	let cs: string;
	$: cs = $editing ? 'editor' : '';
</script>
<ColumnT {name} {header} {...$$restProps}>
	<slot name="filter" slot="filter"><td></td></slot>
	<slot name="header" slot="header" let:title {title}><th scope="col">{title}</th></slot>
	<slot name="footer" slot="footer" />
	<Cell {header} scope="row" class={cs}>
		<slot />
	</Cell>
</ColumnT>