<script lang="ts">
	import Edition from "$lib/components/Table/edition/Edition.svelte";
	import Text from "$lib/components/Table/edition/Text.svelte";
	import Table from "$lib/components/Table/edition/Table.svelte";
	import StringContent from "$lib/components/Table/filters/StringContent.svelte";
	import type { PageData } from "./$types";
	import Select from "$lib/components/Table/edition/Select.svelte";
	import { roles, textTypes } from "$lib/constants";
	import { language, T, ajax, alert } from "$lib/globals";
	import { Button, Icon, Input, Modal, ModalBody, ModalHeader } from "sveltestrap";
	import Column from "$lib/components/Table/Column.svelte";
	import Checkbox from "$lib/components/Table/edition/Checkbox.svelte";
	import po from "./previewObject";
	import { parmed } from "$lib/intl";

	export let data: PageData;
	let textRoles: any[];
$:	textRoles = ['', 'lgdn', 'srv'].concat(roles).map(r=> ({value: r, text: $T('role.'+(r||'none'))}));
	async function save(e: CustomEvent) {
		e.preventDefault();
		const {diff, row, old, effect, cancel} = e.detail;
		if(!row.key) {
			alert({message: $T('err.key.no'), color: 'danger'});
			cancel();
			return;
		}
		if(diff.key && old.key) {
			const rv = await ajax.put({oldK: old.key, newK: row.key});
			if(!rv.ok) return cancel();
		}
		const chg: any = {};
		for(const k of ['text', 'role', 'type']) if(k in diff) chg[k] = diff[k];
		if(Object.keys(chg).length) {
			const rv = await ajax[old.key?'patch':'post']({key: row.key, language: $language, ...chg});
			if(rv.ok) effect(); else cancel();
		} else effect();
	}
	async function remove(e: CustomEvent) {
		const {row, effect, cancel} = e.detail;
		e.preventDefault();
		let rv = await ajax.delete({key: row.key});
		if(rv.ok) effect(); else cancel();
	}
	let previewText = '', previewHtml = false;
	function preview(row: any) {
		previewText = parmed(row.text || '', po);
	}
	// TODO Preview with type
</script>
<Table data={data.dictionary} columnFilters title={$T('ttl.text-keys')}>
	<Column prop="key" title={$T('fld.key')}>
		<StringContent slot="filter" />
		<Text required />
	</Column>
	<Column prop="text" title={$T('fld.text')}>
		<StringContent slot="filter" />
		<Text area />
	</Column>
	<Column prop="role" title={$T('fld.role')}>
		<Select options={textRoles} />
	</Column>
	<Column prop="type" title={$T('fld.type')}>
		<Select options={textTypes} />
	</Column>
	<Edition on:save={save} on:remove={remove}
		create="both" edition="both"
		creation={()=> ({type: 'txt'})}
		deleteConfirmation={{message: 'msg.delete-key', title: 'ttl.delete-key'}}
	>
		<svelte:fragment slot="row" let:row={row}>
			{#if row.type !== 'txt'}<Button color="info" on:click={()=> preview(row)}><Icon name="eye" /></Button>{/if}
		</svelte:fragment>
		<svelte:fragment slot="dialog" let:row={row}>
			{#if row.type !== 'txt'}<Button color="info" on:click={()=> preview(row)}><Icon name="eye" />{$T('cmd.preview')}</Button>{/if}
		</svelte:fragment>
	</Edition>
</Table>
<Modal isOpen={!!previewText}>
	<ModalHeader toggle={()=> { previewText = ''; }}>{$T('ttl.preview')}</ModalHeader>
	<ModalBody>
		{#if previewHtml}
			{@html previewText}
		{:else}
			{previewText}
		{/if}
	</ModalBody>
</Modal>