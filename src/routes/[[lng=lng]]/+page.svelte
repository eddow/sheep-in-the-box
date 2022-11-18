<script lang="ts">
	import { dictionary, T } from '$lib/intl';
	import { useCSR } from '$lib/utils';
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import { object, string } from "yup";
	const schema = object({
		email: string().required().email()
	});
	
	// @ts-ignore
	const formInfo = useCSR(()=> createForm({
		async onSubmit(values: any, context: any) {
			console.log(values);
		},
		extend: validator({schema})
	})), { form, errors } = formInfo;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<form use:form id="testForm" />
<input name="email" form="testForm" />
<button type="submit" form="testForm">submit</button>

<pre>{JSON.stringify($errors, null, '\t')}</pre>