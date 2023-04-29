<script lang="ts">
	/**
	 * Fine tune tables here
	*/
	import ModalEdit from '$sitb/components/table/edition/modal/ModalEdit.svelte';
	import { Field, Input, Accordion, Button, Buttons, Th, Td, NotSaved } from 'svemantic';
	import { cellEditTable, rowEditTable } from "$sitb/components/table/collections";
	import StringContent from "$sitb/components/table/filters/StringContent.svelte";
	import Text from "$sitb/components/table/edition/editor/Text.svelte";
	import MgtPage from '$sitb/components/MgtPage.svelte';
	import { browser } from '$app/environment';
	import Table from '$sitb/components/table/Table.svelte';

	interface Item {
		id: number;
		text: string;
	}
	const ls = !browser ? {
		get td() { return <Item[]>[]; },
		set td(val: Item[]) { /*nothing*/ },
		get ndx() { return 0; }
	} : {
		get td() {
			const tds = localStorage.getItem('test-data'); 
			return <Item[]>(tds ? JSON.parse(tds) : []);
		},
		set td(val: Item[]) { localStorage.setItem('test-data', JSON.stringify(val)); },
		get ndx() {
			const rv = parseInt(localStorage.getItem('test-data-ndx')||'0')+1;
			localStorage.setItem('test-data-ndx', ''+rv);
			return rv;
		}
	};
	let data: Item[] = ls.td;
	const { Table: CeTable, Column: CeColumn, RoColumn } = cellEditTable<Item>();
	const { Table: ReTable, Column: ReColumn, Edition } = rowEditTable<Item>();
	
	async function saveCB(old: Item, diff: Partial<Item>) {
		const xdt = ls.td, item = xdt.find(x=> x.id === old.id);
		let rv: number|undefined = undefined;
		if(!item) xdt.push(<Item>Object.assign({id: rv = ls.ndx}, diff));
		else Object.assign(item, diff);
		ls.td = xdt;
		return rv;
	}
	
	async function deleteCB(item: Item) {
		const xdt = ls.td, ndx = xdt.findIndex(x=> x.id === item.id);
		if(!~ndx) throw new NotSaved('Index not found');
		xdt.splice(ndx, 1);
		ls.td = xdt;
	}

	let modaled: Item|undefined = undefined;

</script>
<MgtPage title="ttl.test">
	<Table class="attached" compact="very" celled striped selectable key="id" bind:data let:model>
		<RoColumn name="id" title="ID" {model} let:model>
			<Th collapsing slot="header">
				ID
			</Th>
		</RoColumn>
		<RoColumn name="text" {model} title="Text" />
	</Table>
	<ReTable class="attached" compact="very" {saveCB} {deleteCB} celled striped selectable key="id" bind:data columnFilters let:model>
		<RoColumn name="id" title="ID" {model}>
			<Th collapsing slot="header">
				ID
			</Th>
		</RoColumn>
		<ReColumn name="text" {model} let:model>
			<Th slot="header">
				Text
			</Th>
			<StringContent slot="filter" />
			<Text placeholder="" {model} />
		</ReColumn>
		<Edition create="both" edition="both" {model} />
	</ReTable>
	
	<CeTable class="attached" compact="very" {saveCB} celled striped selectable key="id" bind:data columnFilters let:model>
		<RoColumn name="id" title="ID" {model}>
			<Th collapsing slot="header">
				ID
			</Th>
		</RoColumn>
		<CeColumn name="text" {model} let:model>
			<Th slot="header">
				Text
			</Th>
			<StringContent slot="filter" />
			<Text placeholder="" {model} />
		</CeColumn>
		<RoColumn {model} let:model>
			<th class="collapsing" slot="header" />
			<Td>
				<Button tiny on:click={()=> modaled = model} icon="external alternate" />
			</Td>
		</RoColumn>
		<ModalEdit slot="modal" bind:model={modaled}>
			<h1 slot="header">
				{modaled?.id}
			</h1>
			<Accordion exclusive={false}>
				<Field name="text"><Input placeholder="" /></Field>
			</Accordion>
			<Buttons slot="actions">
				<Button tiny submit primary icon="save" />
				<Button tiny cancel color="yellow" icon="times" />
			</Buttons>
		</ModalEdit>
	</CeTable>
	
</MgtPage>