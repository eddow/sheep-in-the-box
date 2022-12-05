<script context="module" lang="ts">
	export type SaveCallback<V=any, R=any> = (prop: string, value: V, oldValues: R) => Promise<boolean|undefined|unknown>;
</script>
<script lang="ts">
	import Form from "$lib/components/form/Form.svelte";
	import { privateStore } from "$lib/privateStore";
	import { Button, Icon, InputGroup, InputGroupText, Spinner } from "sveltestrap";
	import { object, type BaseSchema } from "yup";
	import Column from "../../Column.svelte";
	import { getRowCtx, setRowCtx } from "../../utils";
	import { Dialog, Editing, setEdtnCtx, type EditingRowContext } from "../utils";

	export let saveCB: SaveCallback;
	export let prop: string;
	export let headers: boolean = false;
	export let type: BaseSchema;
	export let row: any;
	let empty = false;
	setRowCtx<EditingRowContext>({dialog: Dialog.Wrapped});
$:	empty = row[prop] === undefined;
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
	async function submit({detail}: CustomEvent) {
		const value = detail.values[prop];
		editing.value = Editing.Working;
		if(value === row[prop] || false !== await saveCB(prop, value, row)) {
			row[prop] = value;
			editing.value = Editing.No;
		} else
			editing.value = Editing.Yes;
	}
</script>
<Column {prop} {headers} {...$$restProps} {row}>
	<slot name="filter" slot="filter" />
	<slot name="header" slot="header" />
	<slot name="footer" slot="footer" />
	<Form class={headers?'th':'td'} {schema} on:submit={submit}>
		{#if editing.value}
			<InputGroup>
				<InputGroupText>
					{#if editing.value === Editing.Working}
						<Spinner size="sm" />
					{:else}
						<Button class="xs" size="sm" type="button" on:click={cancelEdit} color="warning"><Icon name="x-lg" /></Button>
						<Button class="xs" size="sm" type="submit" color="primary"><Icon name="save" /></Button>
					{/if}
				</InputGroupText>
				<slot {row} value={row[prop]} />
			</InputGroup>
		{:else}
			<Button
				style="float: left; margin-right: .5em;" size="sm" class="xs"
				type="button" on:click={startEdit} color={empty?'primary':'secondary'}
			><Icon name="pencil" /></Button>
			<slot {row} value={row[prop]} />
		{/if}
	</Form>
</Column>