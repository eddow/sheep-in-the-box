<script context="module" lang="ts">
	export interface EditionModalControl {
		close: ()=> void;
		add: ()=> void;
		edit: (row: any, id: string | number)=> void;
	}
</script>
<script lang="ts">
	import TableRow from "./TableRow.svelte";
	import Table from "../Table.svelte";
	import { Modal, ModalHeader } from "sveltestrap";
	import Body from "./modal/Body.svelte";
	import { enhance } from "$app/forms";
	import Footer from "./modal/Footer.svelte";
	import { setContext } from "svelte";

	export let data: any[];

	let modalOpened: boolean = false;
	let dialogRow: any = {}, dialogId: string | number;
	const modal = {
		close() { modalOpened = false; },
		add() {
			dialogRow = {};
			dialogId = <string><unknown>null;
			modalOpened = true;
		},
		edit(row: any, id: string | number) {
			dialogRow = row;
			dialogId = id;
			modalOpened = true;
		}
	}
	setContext('modal', modal);
	async function submitModal({cancel}: {cancel: ()=> void}) {
		cancel();
		debugger;
		//TODO
	}
</script>
<Table {data} {...$$props} rowType={TableRow} context={{modal}}>
	<slot />
</Table>
<Modal size="lg" isOpen={!!modalOpened}>
	<form use:enhance={x=> { submitModal(x); }}>
		<ModalHeader toggle={modal.close}>Modal title</ModalHeader>
		<Body row={dialogRow} id={dialogId}>
			<slot />
		</Body>
		<Footer row={dialogRow} id={dialogId}>
			<slot />
		</Footer>
	</form>
</Modal>