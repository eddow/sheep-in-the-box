<script lang="ts">
	import type { DictionaryEntry } from './DictionaryEntry';
	import { Button, Th, Td, Popup } from 'svemantic';
	import { cellEditTable } from "$sitb/components/table/collections";
	import StringContent from "$sitb/components/table/filters/StringContent.svelte";
	import Text from "$sitb/components/table/edition/Text.svelte";
	import { ajax, T } from "$sitb/globals";
	import type { PageData } from "./$types";
	import { string } from "yup";
	import Zoom from "./zoom.svelte";
	import LngConfig, { type LangItem } from "../lngConfig.svelte";
	import type { Language } from '$sitb/constants';

	export let data: PageData;
	let dictionary: DictionaryEntry[] = data.transls;
	const {Table, Column, RoColumn} = cellEditTable<DictionaryEntry>()
	let reference: LangItem[], work: LangItem[];
	function config(cnf: {reference: LangItem[], work: LangItem[]}) {
		reference = cnf.reference;
		work = cnf.work;
	}
	const type = string();

	function html(value?: string) {
		return value === undefined;
	}
	function getDisplay(value?: string) {
		return value === undefined ?
			'<i class="grey comment slash icon"></i>' :
			value;
	}

	async function saveCB(language: string, text: string, row: any) {
		if(row[language] !== text)
			return await ajax.patch({key: row.key, diff: {[language]: text}});
	}

	let modaled: DictionaryEntry|undefined = undefined;
	async function saveModal(values: DictionaryEntry) {
		const diff: Record<string, string> = {};
		for(const lng in values)
			if(values[<Language>lng] !== modaled![<Language>lng])
				diff[lng] = values[<Language>lng];
		if(Object.keys(diff).length) {
			await ajax.patch({key: modaled!.key, diff});
			Object.assign(modaled!, diff);
			dictionary = dictionary;
		}
		modaled = undefined;
	}
</script>
<h1 class="ui top attached centered block header">
	{$T('ttl.translations')}
	<Button circular icon="cog" />
	<Popup on="click" wide="very">
		<LngConfig {config} />
	</Popup>
</h1>
<Table class="attached" compact="very" singleLine striped selectable key="key" data={dictionary} columnFilters let:row>
	{#each reference as lng (lng.id)}
		<RoColumn prop={lng.id} title="">
			<Th collapsing class="prefix-icon" slot="header">
				<i class={lng.icon}></i>{lng.text}
			</Th>
			<StringContent slot="filter" />
		</RoColumn>
	{/each}
	{#each work as lng (lng.id)}
		<Column prop={lng.id} {saveCB} {row} let:value>
			<Th class="prefix-icon" slot="header">
				<i class={lng.icon}></i>{lng.text}
			</Th>
			<StringContent slot="filter" />
			<Text {html} {getDisplay} placeholder="" {value} />
		</Column>
	{/each}
	<RoColumn>
		<th class="collapsing" slot="header" />
		<Td>
			<Button tiny on:click={()=> modaled = row} primary={!!row.type} icon="external alternate" />
		</Td>
	</RoColumn>
</Table>
<Zoom model={modaled} save={saveModal} {reference} {work} />