<script lang="ts">
	import Edition from "$lib/components/table/edition/row/Edition.svelte";
	import Text from "$lib/components/table/edition/Text.svelte";
	import Select from "$lib/components/table/edition/Select.svelte";
	import Table from "$lib/components/table/edition/row/Table.svelte";
	import StringContent from "$lib/components/table/filters/StringContent.svelte";
	import type { PageData } from "./$types";
	import { roles, textTypes } from "$lib/constants";
	import { T, ajax, alert } from "$lib/globals";
	import { Button, Icon, Modal, ModalBody, ModalHeader } from "sveltestrap";
	import Column from "$lib/components/table/Column.svelte";
	import Preview from "$lib/components/Preview.svelte";
	import { object, string } from "yup";
	import Languages from "$lib/components/Languages.svelte";
	import { preferences, user } from "$lib/user";

	export let data: PageData;
	let textRoles: any[];
$:	textRoles = ['', 'lgdn', 'srv'].concat(roles).map(r=> ({value: r, text: $T('role.'+(r||'none'))}));
	let prefs = $preferences;
$:	prefs = $preferences;
	if(!prefs.devKeysLng) prefs.devKeysLng = $user.language;
	let dictionaries = {[prefs.devKeysLng]: data.dictionary},
		dictionary = data.dictionary;
	async function saveCB(row: any, old: any, diff: any) {
		if(!row.key) {
			alert({message: $T('err.key.no'), color: 'danger'});
			return false;
		}
		if(diff.key && old.key) {
			const rv = await ajax.put({oldK: old.key, newK: row.key});
			if(!rv.ok) return false;
		}
		const chg: any = {};
		for(const k of ['text', 'role', 'type']) if(k in diff) chg[k] = diff[k];
		if(Object.keys(chg).length) {
			const rv = await ajax[old.key?'patch':'post']({key: row.key, language: prefs.devKeysLng, ...chg});
			if(!old.key) row._id = await rv.json();
			return rv.ok;
		}
	}
	async function deleteCB(row: any) {
		return (await ajax.delete({key: row.key})).ok;
	}
	let previewed: any = null;
	const schema = object({
		key: string().required(),
		text: string(),
		role: string(),
		type: string()
	});
	async function reloadKeys(e: CustomEvent) {
		const lng = e.detail;
		if(!dictionaries[lng]) {
			let qr = await ajax.get('?'+lng);
			dictionaries[lng] = await qr.json();
		}
		dictionary = dictionaries[lng];
	}
</script>
<div style="width: 100%">
	<Languages style="float: left;" bind:language={prefs.devKeysLng} on:set-language={reloadKeys} />
	<h1>
		{$T('ttl.text-keys')}
	</h1>
</div>
<Table key="_id" {schema} data={dictionary} columnFilters {saveCB} {deleteCB} let:row>
	<Column prop="key" title={$T('fld.key')} {row} let:value>
		<StringContent slot="filter" />
		<Text {value}  />
	</Column>
	<Column prop="text" title={$T('fld.text')} {row} let:value>
		<StringContent slot="filter" />
		<Text area {value} />
	</Column>
	<Column prop="role" title={$T('fld.role')} {row} let:value>
		<Select options={textRoles} {value} />
	</Column>
	<Column prop="type" title={$T('fld.type')} {row} let:value>
		<Select options={textTypes} {value} />
	</Column>
	<Edition create="both" edition="both" {row} deleteConfirmation={{message: 'msg.delete-key', title: 'ttl.delete-key'}}>
		<svelte:fragment slot="row" let:row>
			{#if row.type}<Button size="sm" type="button" color="info" on:click={()=> { previewed = row; }}><Icon name="eye" /></Button>{/if}
		</svelte:fragment>
		<svelte:fragment slot="dialog" let:row>
			{#if row.type}<Button type="button" color="info" on:click={()=> { previewed = row; }}><Icon name="eye" />{$T('cmd.preview')}</Button>{/if}
		</svelte:fragment>
	</Edition>
</Table>
<Modal isOpen={!!previewed} size="xl">
	<ModalHeader toggle={()=> { previewed = null; }}>{$T('ttl.preview')}</ModalHeader>
	<ModalBody>
		<Preview text={previewed.text} type={previewed.type} />
	</ModalBody>
</Modal>