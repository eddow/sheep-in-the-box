<script context="module" lang="ts">
	export type SaveCallback<T = any> = (newValues: T, oldValues: T, diff: Partial<T>) => Promise<boolean|void>;
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
	import { ErrorNotSaved, ModalForm } from "svemantic";
	import Buttons from "$svemantic/elements/button/Buttons.svelte";

	type T = $$Generic<{}>;
	type keyT = string & keyof T;

	const TableT = Table<T>;

	export let saveCB: SaveCallback, deleteCB: DeleteCallback | undefined = undefined;
	export let data: T[];
	export let key: keyT;
	const addedRows = new Set<T>();
	const context = {deletable: !!deleteCB};

	let added: T[] = [], allRows: T[];
	$: {
		allRows = [...added, ...data];
	}
	let dialogRow: T|undefined = undefined,
		dialogEditing = privateStore<Editing>(Editing.Yes);

	function setEditing(editing: Editing, row?: T) {
		if(!row || row === dialogRow)
			dialogEditing.value = editing;
	}
	async function saveDialog(values: T) {
		setEditing(Editing.Working);
		await save(values, dialogRow!);
		setEditing(Editing.Yes);
	}
	
	async function save(row: T, old: T) {
		const diff = compare(row, old);
		if(diff) {
			setEditing(Editing.Working, old);
			if(await saveCB(row, old, diff) === false) {
				setEditing(Editing.Yes, old);
				return false;
			}
			let ndxData = data.indexOf(old);
			if(~ndxData) {
				data[ndxData] = {...Object.assign<T,T>(old, row)};
			} else if(addedRows.delete(old)) {
				added = Array.from(addedRows);
				data = [row, ...data];
			} else if(old === dialogRow) {
				data = [row, ...data];
			}
			else throw new ErrorNotSaved("Inconsistent saving behaviour");
			setEditing(Editing.No, old);
			hide();
		}
		return true;
	};

	setEdtnCtx<RowEditionContext>({
		addedRows,
		editing: dialogEditing.store,
		save,
		async deleteRow(row?: T) {
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
			} else hide();
			return true;
		},
		cancelEdit(row?: T) {
			if(row && addedRows.delete(row))
				added = Array.from(addedRows);
			hide();
		},
		addRow(row?: T) {
			addedRows.add(row || <T>{});
			added = Array.from(addedRows);
		},
		editModal(row?: T) {
			dialogRow = row || <T>{};
		}
	});
	let hide: ()=> void;
</script>
<TableT key={key} {...exclude($$props, ['rowType', 'data'])} data={allRows} rowType={TableRow} unfiltered={added} {context} let:row>
	<slot {row} />
	<slot name="header" slot="header" />
	<slot name="footer" slot="footer" />
	<svelte:fragment slot="once">
		<ModalForm bind:hide save={saveDialog} huge bind:model={dialogRow}>
			<ModalPart dialog={Dialog.Body} row={dialogRow}>
				<slot row={dialogRow} />
			</ModalPart>
			<Buttons slot="actions">
				<ModalPart dialog={Dialog.Footer} row={dialogRow}>
					<slot row={dialogRow} />
				</ModalPart>
			</Buttons>
		</ModalForm>
		<slot name="once" />
	</svelte:fragment>
</TableT>