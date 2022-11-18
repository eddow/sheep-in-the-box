<script lang="ts">
	import { useCSR } from "$lib/utils";
	import { createForm } from "felte";
	import { validator } from '@felte/validator-yup';
	import type { ObjectShape, OptionalObjectSchema } from "yup/lib/object";
	import { createEventDispatcher } from 'svelte';
	import { setFrmCtx } from "./utils";

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
</script>
<form use:form {...$$restProps}>
	<slot />
</form>