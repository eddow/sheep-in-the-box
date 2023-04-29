<script lang="ts">
	import { Field, Input, type FieldContext, type RulesSpec } from 'svemantic';
	import CellDisplay from '../../CellDisplay.svelte';
	import { getClmnCtx, getEdtnCtx } from '../contexts'

	type T = $$Generic;

	const
		CellDisplayT = CellDisplay<T>,
		edtnCtx = getEdtnCtx(),
		{ dialog, editing, actions } = edtnCtx,
		{ field, title } = getClmnCtx();
	console.assert(field, 'Automatic edition requires field name');
	export let
		getDisplay: (x: any, model: T)=> string = x=>x,
		required: boolean = false,
		validate: RulesSpec|undefined = undefined,
		model: any;
	let cs: string = actions ? 'left action' : '';
</script>
{#if field && $editing && dialog !== 'actions'}
	<Field {required} {validate} name={field.name} label={dialog && $title}>
		<Input class={cs} fluid={!dialog} form={edtnCtx.form}>
			<svelte:component this={actions} />
			<slot />
		</Input>
	</Field>
{:else if !dialog}
	<slot name="display">
		<CellDisplayT {getDisplay} {model} />
	</slot>
{/if}
<style lang="scss" global>
td.editor .ui.input textarea {
	min-height: 2.6em;
	border: 0;
	overflow-y: auto;
}
</style>