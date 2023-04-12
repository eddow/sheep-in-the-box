<script lang="ts">
	import type { Readable } from 'svelte/store';

	import { Field, Input, type FieldContext, type RulesSpec } from 'svemantic';
	import CellDisplay from '../../CellDisplay.svelte';
	import { getClmnCtx, getEdtnCtx } from '../contexts'

	type T = $$Generic;

	const
		edtnCtx = getEdtnCtx(),
		{ dialog, editing, actions } = edtnCtx,
		{ field, title } = <{field: FieldContext, title: Readable<string>}>getClmnCtx();
	console.assert(field, 'Automatic edition requires field name');
	export let
		getDisplay: (x: any, row: T)=> string = x=>x,
		required: boolean = false,
		validate: RulesSpec|undefined = undefined;
	let cs: string = actions ? 'left action' : '';
</script>
{#if $editing && dialog !== 'actions'}
	<Field {required} {validate} name={field.name} label={dialog && $title}>
		<Input class={cs} fluid={!dialog} form={edtnCtx.form}>
			<svelte:component this={actions} />
			<slot />
		</Input>
	</Field>
{:else if !dialog}
	<slot name="display">
		<CellDisplay {getDisplay} />
	</slot>
{/if}
<style lang="scss" global>
td.editor .ui.input textarea {
	min-height: 2.6em;
	border: 0;
	overflow-y: auto;
}
</style>