<script lang="ts">
	import Text from "$sitb/components/table/edition/editor/Text.svelte";
	import Select from "$sitb/components/table/edition/editor/Select.svelte";
	import StringContent from "$sitb/components/table/filters/StringContent.svelte";
	import type { PageData } from "./$types";
	import { roles, textTypes, type Language, type Role, type TextType } from "$sitb/constants";
	import { I, language } from "$sitb/intl";
	import { ajax } from "$sitb/ajax";
	import Preview from "$sitb/components/Preview.svelte";
	import Languages from "$sitb/components/Languages.svelte";
	import { preference, Side } from "$sitb/preferences";
	import type { Writable } from "svelte/store";
	import { Button, NotSaved, Modal, type DropdownOption } from "svemantic";
	import { rowEditTable } from "$sitb/components/table/collections";
	import MgtPage from "$sitb/components/MgtPage.svelte";
	
	interface DictionaryEntry {
		key: string;
		text: string;
		role : Role|'srv'|'';
		type: TextType;
	}

	const { Table, Column, Edition } = rowEditTable<DictionaryEntry>()

	export let data: PageData;
	let textRoles: DropdownOption[];
	$: textRoles = ['', 'lgdn', 'srv'].concat(roles).map(r=> ({value: r, text: $I('role.'+(r||'none'))}));
	let kLang = <Writable<Language>>preference('devKeysLng', Side.server, $language);
	let dictionaries = {[$kLang || $language]: data.dictionary},
		dictionary = data.dictionary;
	async function saveCB(old: DictionaryEntry, diff: Partial<DictionaryEntry>) {
		const key = diff.key || old.key;
		if(!(diff.key || old.key)) throw new Error('No key given for text');
		if(diff.key && old.key) {
			const rv = await ajax.put({oldK: old.key, newK: diff.key});
			if(!rv.ok) throw new NotSaved('Cannot change key');
		}
		const chg: Partial<DictionaryEntry> = {};
		for(const k of <(keyof DictionaryEntry)[]>['text', 'role', 'type']) if(k in diff) chg[k] = <any>diff[k];
		if(Object.keys(chg).length) {
			const rv = await ajax[old.key?'patch':'post']({key, language: $kLang, ...chg});
			if(!rv.ok) throw new NotSaved('Cannot set infos');
		}
	}
	async function deleteCB(row: DictionaryEntry) {
		return (await ajax.delete({key: row.key})).ok;
	}
	let previewed: DictionaryEntry|undefined = undefined;
	async function reloadKeys({detail: lng}: CustomEvent<Language>) {
		if(!dictionaries[lng]) {
			let qr = await ajax.get('?'+lng);
			dictionaries[lng] = await qr.json();
		}
		dictionary = dictionaries[lng];
	}
	let textTypeOptions: DropdownOption[] = textTypes.map(ttp=> ({value: ttp, text: $I('ttp.'+(ttp || 'none'))}))
</script>
<MgtPage title="ttl.text-keys">
	<Languages slot="config" bind:language={$kLang} on:set-language={reloadKeys} />
	<Table class="attached" compact="very" single-line striped selectable key="key" data={dictionary} columnFilters {saveCB} {deleteCB} let:model>
		<Column name="key" title={$I('fld.key')}>
			<StringContent slot="filter" />
			<Text required />
		</Column>
		<Column name="text" title={$I('fld.text')}>
			<StringContent slot="filter" />
			<Text type="area" />
		</Column>
		<Column name="role" title={$I('fld.role')}>
			<Select options={textRoles} />
		</Column>
		<Column name="type" title={$I('fld.type')}>
			<Select options={textTypeOptions} />
		</Column>
		<Edition create="both" edition="both" deleteConfirmation="msg.delete-key">
			<svelte:fragment slot="row" let:model>
				{#if model?.type}<Button tiny color="blue" tertiary on:click={()=> { previewed = model; }} icon="eye" ></Button>{/if}
			</svelte:fragment>
			<svelte:fragment slot="dialog" let:model>
				{#if model?.type}<Button color="blue" tertiary on:click={()=> { previewed = model; }} icon="eye" >{$I('cmd.preview')}</Button>{/if}
			</svelte:fragment>
		</Edition>
	</Table>
</MgtPage>
<Modal allowMultiple huge opened={!!previewed} on:hidden={()=> previewed = undefined}>
	<svelte:fragment slot="header">{$I('ttl.preview')}</svelte:fragment>
	{#if previewed}<Preview text={previewed.text} type={previewed.type} />{/if}
</Modal>