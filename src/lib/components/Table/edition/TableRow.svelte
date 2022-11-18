<script lang="ts">
	import { getContext } from "svelte";
	import { writable } from "svelte/store";
	import TableRow from "../TableRow.svelte";
	import type { EditionControl } from "./utils";
	import { useCSR } from "$lib/utils";
	import { createForm } from "felte";
	import { validator } from '@felte/validator-yup';
	import type { ObjectShape, OptionalObjectSchema } from "yup/lib/object";
	import { createEventDispatcher } from 'svelte';
	import { setFrmCtx } from "$lib/components/form/utils";
	import { setRowCtx } from "../utils";

	export let row: any;
	export let id: string|number;
	const {editions} = getContext<EditionControl>('edition');

	const dispatch = createEventDispatcher();

	export let schema: OptionalObjectSchema<ObjectShape>;
	// @ts-ignore
	export const formInfo = useCSR(()=> createForm({
		async onSubmit(values: any, context: any) {
			dispatch('submit', {values, context});
		},
		extend: validator({schema})
	})), form = formInfo.form;
	setFrmCtx(formInfo);
	setRowCtx({editing: editions.get(row) || writable<any>(null), dialog: false, row, id});
</script>
<tr data-row-id={''+id} {...$$restProps}>
	<slot />
</tr>