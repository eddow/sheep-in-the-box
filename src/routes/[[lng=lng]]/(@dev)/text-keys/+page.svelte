<script lang="ts">
	import Edition from "$sitb/components/table/edition/row/Edition.svelte";
	import Text from "$sitb/components/table/edition/Text.svelte";
	import Select from "$sitb/components/table/edition/Select.svelte";
	import Table from "$sitb/components/table/edition/row/Table.svelte";
	import StringContent from "$sitb/components/table/filters/StringContent.svelte";
	import type { PageData } from "./$types";
	import { roles, textTypes, type Language } from "$sitb/constants";
	import { I, ajax } from "$sitb/globals";
	import { Button, Icon, Modal, ModalBody, ModalHeader } from "sveltestrap";
	import Column from "$sitb/components/table/Column.svelte";
	import Preview from "$sitb/components/Preview.svelte";
	import { object, string } from "yup";
	import Languages from "$sitb/components/Languages.svelte";
	import { preference, Side } from "$sitb/preferences";
	import { user } from "$sitb/user";
	import type { Writable } from "svelte/store";
	import { toast } from "svemantic";
	
	export let data: PageData;
	let textRoles: any[];
$:	textRoles = ['', 'lgdn', 'srv'].concat(roles).map(r=> ({value: r, text: $I('role.'+(r||'none'))}));
	let kLang = <Writable<Language>>preference('devKeysLng', Side.server, $user.language);
	let dictionaries = {[$kLang || $user.language]: data.dictionary},
		dictionary = data.dictionary;
	async function saveCB(row: any, old: any, diff: any) {
		if(!row.key) {
			toast({message: $I('err.key.no'), class: 'error'});
			return false;
		}
		if(diff.key && old.key) {
			const rv = await ajax.put({oldK: old.key, newK: row.key});
			if(!rv.ok) return false;
		}
		const chg: any = {};
		for(const k of ['text', 'role', 'type']) if(k in diff) chg[k] = diff[k];
		if(Object.keys(chg).length) {
			const rv = await ajax[old.key?'patch':'post']({key: row.key, language: $kLang, ...chg});
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
	<Languages bind:language={$kLang} on:set-language={reloadKeys} />
	<h1>
		{$I('ttl.text-keys')}
	</h1>
</div>
<Table key="_id" {schema} data={dictionary} columnFilters {saveCB} {deleteCB} let:row>
	<Column prop="key" title={$I('fld.key')} let:value>
		<StringContent slot="filter" />
		<Text {value}  />
	</Column>
	<Column prop="text" title={$I('fld.text')} let:value>
		<StringContent slot="filter" />
		<Text area {value} />
	</Column>
	<Column prop="role" title={$I('fld.role')} let:value>
		<Select options={textRoles} {value} />
	</Column>
	<Column prop="type" title={$I('fld.type')} let:value>
		<Select options={textTypes} {value} />
	</Column>
	<Edition create="both" edition="both" deleteConfirmation="msg.delete-key">
		<svelte:fragment slot="row">
			{#if row.type}<Button size="sm" type="button" color="info" on:click={()=> { previewed = row; }}><Icon name="eye" /></Button>{/if}
		</svelte:fragment>
		<svelte:fragment slot="dialog">
			{#if row.type}<Button type="button" color="info" on:click={()=> { previewed = row; }}><Icon name="eye" />{$I('cmd.preview')}</Button>{/if}
		</svelte:fragment>
	</Edition>
</Table>
<Modal isOpen={!!previewed} size="xl">
	<ModalHeader toggle={()=> { previewed = null; }}>{$I('ttl.preview')}</ModalHeader>
	<ModalBody>
		<Preview text={previewed.text} type={previewed.type} />
	</ModalBody>
</Modal>