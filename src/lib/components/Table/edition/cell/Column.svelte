<script lang="ts">
	import Form from "$lib/components/form/Form.svelte";
	import { privateStore } from "$lib/privateStore";
	import { Button, Icon } from "sveltestrap";
	import { object, type BaseSchema } from "yup";
	import Column from "../../Column.svelte";
	import { Editing, setEdtnCtx } from "../utils";

	export let prop: string;
	export let headers: boolean = false;
	export let type: BaseSchema;
	const editing = privateStore<Editing>(Editing.No);
	const schema = object({[prop]: type});
	setEdtnCtx({
		schema, editing: editing.store
	});
	function startEdit() {
		editing.value = Editing.Yes;
	}
	function cancelEdit() {
		editing.value = Editing.No;
	}
</script>
<Column {prop} {headers} {...$$restProps}>
	<slot name="filter" slot="filter" />
	<slot name="header" slot="header" />
	<slot name="footer" slot="footer" />
	<Form class={headers?'th':'td'} {schema}>
		{#if editing.value}
			<div style="float: left; margin-right: .5em;">
				<Button style="padding: 0 5px;" size="sm" type="button" on:click={cancelEdit} color="danger"><Icon name="x-lg" /></Button>
				<Button style="padding: 0 5px;" size="sm" type="submit" color="primary"><Icon name="save" /></Button>
			</div>
		{:else}
			<Button
				style="padding: 0 5px; float: left; margin-right: .5em;" size="sm"
				type="button" on:click={startEdit} color="secondary"
			><Icon name="pencil" /></Button>
		{/if}
		<slot />
	</Form>
</Column>