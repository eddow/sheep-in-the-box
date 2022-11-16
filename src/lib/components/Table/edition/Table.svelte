<script lang="ts">
	import TableRow from "./TableRow.svelte";
	import Table from "../Table.svelte";
	import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
	import { enhance } from "$app/forms";
	import { setContext } from "svelte";
	import ModalPart from "./ModalPart.svelte";
	import { writable, type Writable } from "svelte/store";
	import { exclude } from "../utils/exclude";
	import { clone } from "./utils";

	export let data: any[];
	let added: any[] = [];
$:	allRows = [...added, ...data];
	let modalOpened = false;
	let dialogRow: any = null, dialogId: string | number | undefined;
	let dialogEdit: Writable<any>;
	// TODO titles
	const modal = {
		close() {
			modalOpened = false;
		},
		add(row: Writable<any>) {
			dialogRow = clone(row);
			dialogEdit = writable(row);
			dialogId = undefined;
			modalOpened = true;
		},
		edit(editing: Writable<any>, row: any, id: string | number) {
			dialogRow = row;
			dialogEdit = editing;
			dialogId = id;
			modalOpened = true;
		}
	};
	const editions = new Map<any, SvelteStore<any>>();
	const rowCreation = {
		add(row: any) {
			added = [row, ...added];
			editions.set(row, writable(clone(row)));
		},
		save(row: any, old: any) {
			let ndxAdded = added.indexOf(old), ndxData = data.indexOf(old);
			if(~ndxAdded) {
				added = [...added.slice(0, ndxAdded), ...added.slice(ndxAdded+1)];
				data = [row, ...data];
			} else if(~ndxData) {
				for(const k of Object.keys(old)) delete old[k];
				setTimeout(()=> {
					Object.assign(old, row);
					data = [...data];
				});
				data = [...data];
			} else if(old === dialogRow)
				data = [row, ...data];
			else throw "Inconsistent saving behaviour";
		},
		cancel(row: any) {
			const ndx = added.indexOf(row);
			if(~ndx)
				added = [...added.slice(0, ndx), ...added.slice(ndx+1)];
		},
		delete(row: any) {
			const ndx = data.indexOf(row);
			if(~ndx)
				data = [...data.slice(0, ndx), ...data.slice(ndx+1)];
		}
	};
	setContext('edition', {modal, rowCreation, editions});
	
	async function submitModal({cancel}: {cancel: ()=> void}) {
		cancel();
	}
</script>
<Table key="key" {...exclude($$props, ['rowType', 'data'])} data={allRows} rowType={TableRow} unfiltered={added}>
	<slot />
</Table>
<Modal keyboard={true} size="lg" isOpen={modalOpened}>
	<form use:enhance={x=> { submitModal(x); }}>
		<ModalHeader>Modal title</ModalHeader>
		<ModalBody>
			<ModalPart row={dialogRow} id={dialogId} dialog="body" editing={dialogEdit}>
				<slot />
			</ModalPart>
		</ModalBody>
		<ModalFooter>
			<ModalPart row={dialogRow} id={dialogId} dialog="footer" editing={dialogEdit}>
				<slot />
			</ModalPart>
		</ModalFooter>
	</form>
</Modal>