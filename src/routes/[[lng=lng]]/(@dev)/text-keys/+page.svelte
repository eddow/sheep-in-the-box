<script lang="ts">
	import Edition from "$sitb/components/table/edition/row/Edition.svelte";
	import Text from "$sitb/components/table/edition/editor/Text.svelte";
	import Select from "$sitb/components/table/edition/editor/Select.svelte";
	import StringContent from "$sitb/components/table/filters/StringContent.svelte";
	import type { PageData } from "./$types";
	import { roles, textTypes, type Language, type Role, type TextType } from "$sitb/constants";
	import { I, ajax, language } from "$sitb/globals";
	import Preview from "$sitb/components/Preview.svelte";
	import Languages from "$sitb/components/Languages.svelte";
	import { preference, Side } from "$sitb/preferences";
	import type { Writable } from "svelte/store";
	import type { DevDictionaryEntry } from "$sitb/intl";
	import { Button, NotSaved, Modal, toast, type DropdownOption } from "svemantic";
	import { rowEditTable } from "$sitb/components/table/collections";
	import MgtPage from "$sitb/components/MgtPage.svelte";
	
	const { Table, Column } = rowEditTable<DevDictionaryEntry>()

	export let data: PageData;
	let textRoles: DropdownOption[];
	$: textRoles = ['lgdn', 'srv'].concat(roles).map(r=> ({value: r, text: $I('role.'+(r||'none'))}));
	let kLang = <Writable<Language>>preference('devKeysLng', Side.server, $language);
	let dictionaries = {[$kLang || $language]: data.dictionary},
		dictionary = data.dictionary;
	async function saveCB(old: DevDictionaryEntry, diff: Partial<DevDictionaryEntry>) {
		const key = diff.key || old.key;
		if(!(diff.key || old.key)) throw new Error('No key given for text');
		const rv = await (old.key ?
			ajax.patch({key: old.key, language: $kLang, diff}) :
			ajax.post({language: $kLang, ...diff}) );
		if(!rv.ok) throw new NotSaved('Cannot set infos');
	}
	async function deleteCB(row: DevDictionaryEntry) {
		return (await ajax.delete({key: row.key})).ok;
	}
	let previewed: DevDictionaryEntry|undefined = undefined;
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
		<Column name="key">
			<StringContent slot="filter" />
			<Text required />
		</Column>
		<Column name="text">
			<StringContent slot="filter" />
			<Text type="area" />
		</Column>
		<Column name="roles">
			<Select options={textRoles} multiple delimiter="|" />
		</Column>
		<Column name="type">
			<Select options={textTypeOptions} />
		</Column>
		<Edition create="both" edition="both" deleteConfirmation="msg.delete-key">
			<svelte:fragment slot="row">
				{#if model?.type}<Button tiny color="blue" tertiary on:click={()=> { previewed = model; }} icon="eye" ></Button>{/if}
			</svelte:fragment>
			<svelte:fragment slot="dialog">
				{#if model?.type}<Button color="blue" tertiary on:click={()=> { previewed = model; }} icon="eye" >{$I('cmd.preview')}</Button>{/if}
			</svelte:fragment>
		</Edition>
	</Table>
</MgtPage>
<Modal allowMultiple huge opened={!!previewed} on:hidden={()=> previewed = undefined}>
	<svelte:fragment slot="header">{$I('ttl.preview')}</svelte:fragment>
	{#if previewed}<Preview text={previewed.text} type={previewed.type} />{/if}
</Modal>