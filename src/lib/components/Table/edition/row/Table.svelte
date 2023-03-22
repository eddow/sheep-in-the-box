<script context="module" lang="ts">
	export type SaveCallback<T = any> = (newValues: T, oldValues: T, diff: any) => Promise<boolean|void>;
	export type DeleteCallback<T = any> = (values: T) => Promise<boolean|void>;
</script>
<script lang="ts">
	import TableRow from "./TableRow.svelte";
	import Table from "../../Table.svelte";
	import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
	import ModalPart from "../ModalPart.svelte";
	import { exclude } from "../../../utils/exclude";
	import { compare, Dialog, Editing, setEdtnCtx, type RowEditionContext } from "../utils";
	import type { ObjectShape, OptionalObjectSchema } from "yup/lib/object";
	import Form from "$sitb/components/form/Form.svelte";
	import { privateStore } from "$sitb/privateStore";

	export let saveCB: SaveCallback, deleteCB: DeleteCallback | undefined = undefined;
	export let data: any[];
	export let key: string;
	const addedRows = new Set<any>();
	const context = {deletable: !!deleteCB};

	let added: any[] = [];
$:	allRows = [...added, ...data];
	let modalOpened = false,
		dialogRow: any = null,
		dialogEditing = privateStore<Editing>(Editing.Yes);
	export let title: string = '';
	
	export let schema: OptionalObjectSchema<ObjectShape>;

	function setEditing(editing: Editing, row?: any) {
		if(!row || row === dialogRow)
			dialogEditing.value = editing;
	}
	async function saveRow({detail}: CustomEvent) {
		setEditing(Editing.Working);
		if(await save(detail.values, dialogRow))		
			modalOpened = false;
		setEditing(Editing.Yes);
	}
	
	async function save(row: any, old: any) {
		const diff = compare(row, old);
		if(diff) {
			setEditing(Editing.Working, old);
			if(await saveCB(row, old, diff) === false) {
				setEditing(Editing.Yes, old);
				return false;
			}
			let ndxData = data.indexOf(old);
			if(~ndxData) {
				data[ndxData] = {...Object.assign(old, row)};
				allRows = allRows;
			} else if(addedRows.delete(old)) {
				added = Array.from(addedRows);
				data = [row, ...data];
			} else if(old === dialogRow) {
				data = [row, ...data];
				modalOpened = false;
			}
			else throw "Inconsistent saving behaviour";
			setEditing(Editing.No, old);
			dialogRow = null;
		}
		return true;
	};

	setEdtnCtx<RowEditionContext>({
		addedRows, schema,
		editing: dialogEditing.store,
		save,
		async deleteRow(row?: any) {
			let exEditing = dialogEditing.value;
			setEditing(Editing.Working, row);
			try {
				if(await deleteCB!(row || dialogRow) === false)
					return false;
			} finally {
				setEditing(exEditing, row);
			}
			if(row) {
				const ndx = data.indexOf(row);
				if(~ndx)
					data = [...data.slice(0, ndx), ...data.slice(ndx+1)];
			} else dialogRow = null;
			return true;
		},
		cancelEdit(row?: any) {
			if(row && addedRows.delete(row))
				added = Array.from(addedRows);
			modalOpened = false;
		},
		addRow(row?: any) {
			addedRows.add(row || {});
			added = Array.from(addedRows);
		},
		editModal(row?: any) {
			dialogRow = row || {};
			modalOpened = true;
		}
	});
</script>
<Table key={key} {...exclude($$props, ['rowType', 'data'])} data={allRows} rowType={TableRow} unfiltered={added} {context} let:row>
	<slot {row} />
	<slot name="header" slot="header" />
	<slot name="footer" slot="footer" />
	<svelte:fragment slot="once">
		<Modal keyboard={true} size="xl" isOpen={modalOpened}>
			{#if dialogRow}
				<Form {schema} on:submit={saveRow}>
					{#if title}<ModalHeader>{title}</ModalHeader>{/if}
					<ModalBody>
						<ModalPart dialog={Dialog.Body}>
							<slot row={dialogRow} />
						</ModalPart>
					</ModalBody>
					<ModalFooter>
						<ModalPart dialog={Dialog.Footer}>
							<slot row={dialogRow} />
						</ModalPart>
					</ModalFooter>
				</Form>
			{/if}
		</Modal>
		<slot name="once" />
	</svelte:fragment>
</Table>