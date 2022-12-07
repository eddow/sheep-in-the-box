<script lang="ts">
	import Form from "$lib/components/form/Form.svelte";
	import MultiSelect from "$lib/components/form/MultiSelect.svelte";
	import { alert } from "$lib/globals";
	import { array, object, string } from "yup";

	const ui_libs = [{label: `Svelte`, value: 'S'}, {label: `React`}, {label: `Vue`, value: 'V'}, {label: `Angular`, value: 'A'}, `...`]

	let selected: any[] = [],
		value: string;

	const schema = object({
		test: string().required()
	});
	function submit({detail}: CustomEvent) {
		alert({message: detail.values.test});
	}
</script>
<Form {schema} on:submit={submit}>
	<code>selected = {JSON.stringify(selected)}
value = {JSON.stringify(value)}</code>
	<MultiSelect name="test" bind:value bind:selected>
		<option value="AF">Afrikanns</option>
		<option value="SQ"><i>Albanian</i></option>
		<option value="AR">Arabic</option>
		<option value="HY">Armenian</option>
	</MultiSelect>
	<button type="submit">Yup</button>
</Form>
<svelte:head>
	<title>Home</title>
</svelte:head>
