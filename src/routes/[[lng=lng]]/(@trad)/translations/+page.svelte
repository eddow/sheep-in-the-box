<script lang="ts">
	import { NotSaved } from 'svemantic';
	import type { DictionaryEntry } from './DictionaryEntry';
	import { Button, Th, Td, Popup } from 'svemantic';
	import { cellEditTable } from "$sitb/components/table/collections";
	import StringContent from "$sitb/components/table/filters/StringContent.svelte";
	import Text from "$sitb/components/table/edition/editor/Text.svelte";
	import { ajax, I } from "$sitb/globals";
	import type { PageData } from "./$types";
	//import Zoom from "./zoom.svelte";
	import LngConfig, { type LangItem } from "../lngConfig.svelte";
	import type { Language } from '$sitb/constants';
	import MgtPage from '$sitb/components/MgtPage.svelte';

	export let data: PageData;
	let dictionary: DictionaryEntry[] = data.transls;
	const { Table, Column, RoColumn } = cellEditTable<DictionaryEntry>()
	let reference: LangItem[], work: LangItem[];
	function config(cnf: {reference: LangItem[], work: LangItem[]}) {
		reference = cnf.reference;
		work = cnf.work;
	}

	function html(value?: string) {
		return value === undefined;
	}
	function getDisplay(value?: string) {
		return value === undefined ?
			'<i class="grey comment slash icon"></i>' :
			value;
	}

	async function saveCB(old: DictionaryEntry, diff: Partial<DictionaryEntry>) {
		const rv = await ajax.patch({key: old.key, diff});
		if(!rv.ok) throw new NotSaved(await rv.text());
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
<MgtPage title="ttl.translations">
	<svelte:fragment slot="config">
		<Button circular icon="cog" />
		<Popup on="click" wide="very">
			<LngConfig {config} />
		</Popup>
	</svelte:fragment>
	<Table class="attached" compact="very" {saveCB} singleLine striped selectable key="key" data={dictionary} columnFilters>
		{#each reference as lng (lng.id)}
			<RoColumn name={lng.id} title="">
				<Th collapsing class="prefix-icon" slot="header">
					<i class={lng.icon}></i>{lng.text}
				</Th>
				<StringContent slot="filter" />
			</RoColumn>
		{/each}
		{#each work as lng (lng.id)}
			<Column name={lng.id} {html} {getDisplay}>
				<Th class="prefix-icon" slot="header">
					<i class={lng.icon}></i>{lng.text}
				</Th>
				<StringContent slot="filter" />
				<Text placeholder="" />
			</Column>
		{/each}
	<!--
		<RoColumn>
			<th class="collapsing" slot="header" />
			<Td>
				<Button tiny on:click={()=> modaled = model} primary={!!model.type} icon="external alternate" />
			</Td>
		</RoColumn>
	-->
	</Table>
	<!--Zoom model={modaled} save={saveModal} {reference} {work} /-->
</MgtPage>