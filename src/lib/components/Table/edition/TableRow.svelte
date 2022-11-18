<script lang="ts">
	import { getContext } from "svelte";
	import { writable } from "svelte/store";
	import TableRow from "../TableRow.svelte";
	import type { EditionControl } from "./utils";
	import { useCSR } from "$lib/utils";
	import { createForm } from "felte";
	import { validator } from '@felte/validator-yup';
	import { createEventDispatcher } from 'svelte';
	import { setFrmCtx, type FormAction, type FormContext } from "$lib/components/form/utils";
	import { setRowCtx } from "../utils";
	import Form from "$lib/components/form/Form.svelte";

	export let row: any;
	export let id: string|number;
	const {editions} = getContext<EditionControl>('edition');

	const dispatch = createEventDispatcher();

	const { schema } = getContext<EditionControl>('edition')
	const dataRow = typeof row !== 'string';
	// @ts-ignore
	export const formInfo = dataRow ? useCSR(()=> createForm({
		// TODO Have `initialValues`
		initialValues: row,
		async onSubmit(values: any, context: any) {
			dispatch('submit', {values, context});
		},
		extend: validator({schema})
	})) : {form: null}, form = <FormAction>formInfo.form;
	if(dataRow) setFrmCtx(<FormContext>formInfo);
	setRowCtx({editing: editions.get(row) || writable<any>(null), dialog: false, row, id});
</script>
{#if dataRow}
	<form use:form class="tr" data-row-id={''+id} {...$$restProps}>
		<slot />
	</form>
{:else}
	<div class="tr" data-row-id={row} {...$$restProps}>
		<slot />
	</div>
{/if}