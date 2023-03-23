<script lang="ts">
	import Edition from "$sitb/components/table/edition/row/Edition.svelte";
	import Text from "$sitb/components/table/edition/Text.svelte";
	import Select from "$sitb/components/table/edition/Select.svelte";
	import Table from "$sitb/components/table/edition/row/Table.svelte";
	import StringContent from "$sitb/components/table/filters/StringContent.svelte";
	import type { PageData } from "./$types";
	import { roles, textTypes, type Language, type Role, type TextType } from "$sitb/constants";
	import { I, ajax } from "$sitb/globals";
	import Column from "$sitb/components/table/Column.svelte";
	import Preview from "$sitb/components/Preview.svelte";
	import { object, string } from "yup";
	import Languages from "$sitb/components/Languages.svelte";
	import { preference, Side } from "$sitb/preferences";
	import { user } from "$sitb/user";
	import type { Writable } from "svelte/store";
	import { Button, Modal, toast, type DropdownOption } from "svemantic";
	
	interface DictionaryEntry {
		_id?: string
		key: string;
		text: string;
		role : Role|'srv'|'';
		type: TextType;
	}

	export let data: PageData;
	let textRoles: DropdownOption[];
$:	textRoles = ['', 'lgdn', 'srv'].concat(roles).map(r=> ({value: r, text: $I('role.'+(r||'none'))}));
	let kLang = <Writable<Language>>preference('devKeysLng', Side.server, $user.language);
	let dictionaries = {[$kLang || $user.language]: data.dictionary},
		dictionary = data.dictionary;
	async function saveCB(row: DictionaryEntry, old: DictionaryEntry, diff: Partial<DictionaryEntry>) {
		if(!row.key) {
			toast({message: $I('err.key.no'), class: 'error'});
			return false;
		}
		if(diff.key && old.key) {
			const rv = await ajax.put({oldK: old.key, newK: row.key});
			if(!rv.ok) return false;
		}
		const chg: Partial<DictionaryEntry> = {};
		for(const k of <(keyof DictionaryEntry)[]>['text', 'role', 'type']) if(k in diff) chg[k] = <any>diff[k];
		if(Object.keys(chg).length) {
			const rv = await ajax[old.key?'patch':'post']({key: row.key, language: $kLang, ...chg});
			if(!old.key) row._id = await rv.json();
			return rv.ok;
		}
	}
	async function deleteCB(row: DictionaryEntry) {
		return (await ajax.delete({key: row.key})).ok;
	}
	let previewed: DictionaryEntry|undefined = undefined;
	const schema = object({
		key: string().required(),
		text: string(),
		role: string(),
		type: string()
	});
	async function reloadKeys({detail: lng}: CustomEvent<Language>) {
		if(!dictionaries[lng]) {
			let qr = await ajax.get('?'+lng);
			dictionaries[lng] = await qr.json();
		}
		dictionary = dictionaries[lng];
	}
	let textTypeOptions: DropdownOption[] = textTypes.map(ttp=> ({value: ttp, text: $I('ttp.'+(ttp || 'none'))}))
</script>
<h1 class="ui top attached centered block header">
	{$I('ttl.text-keys')}
	<Languages bind:language={$kLang} on:set-language={reloadKeys} />
</h1>
<Table class="attached" compact="very" singleLine striped selectable key="_id" {schema} data={dictionary} columnFilters {saveCB} {deleteCB} let:row>
	<Column prop="key" title={$I('fld.key')} let:value>
		<StringContent slot="filter" />
		<Text {value} />
	</Column>
	<Column prop="text" title={$I('fld.text')} let:value>
		<StringContent slot="filter" />
		<Text area {value} />
	</Column>
	<Column prop="role" title={$I('fld.role')} let:value>
		<Select options={textRoles} {value} />
	</Column>
	<Column prop="type" title={$I('fld.type')} let:value>
		<Select options={textTypeOptions} {value} />
	</Column>
	<Edition create="both" edition="both" deleteConfirmation="msg.delete-key">
		<svelte:fragment slot="row">
			{#if row?.type}<Button tiny color="blue" tertiary on:click={()=> { previewed = row; }} icon="eye" ></Button>{/if}
		</svelte:fragment>
		<svelte:fragment slot="dialog">
			{#if row?.type}<Button color="blue" tertiary on:click={()=> { previewed = row; }} icon="eye" >{$I('cmd.preview')}</Button>{/if}
		</svelte:fragment>
	</Edition>
</Table>
<Modal allowMultiple huge opened={!!previewed} on:hidden={()=> previewed = undefined}>
	<svelte:fragment slot="header">{$I('ttl.preview')}</svelte:fragment>
	{#if previewed}<Preview text={previewed.text} type={previewed.type} />{/if}
</Modal>