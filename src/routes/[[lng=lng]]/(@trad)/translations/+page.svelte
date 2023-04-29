<script lang="ts">
	import ModalEdit from '$sitb/components/table/edition/modal/ModalEdit.svelte';
	import { Input, Field, Accordion, Flag, NotSaved, Page, Button, Buttons, Th, Td, Popup } from 'svemantic';
	import { cellEditTable } from "$sitb/components/table/collections";
	import StringContent from "$sitb/components/table/filters/StringContent.svelte";
	import Text from "$sitb/components/table/edition/editor/Text.svelte";
	import { ajax } from "$sitb/globals";
	import type { PageData } from "./$types";
	import LngConfig, { type LangItem } from "../lngConfig.svelte";
	import MgtPage from '$sitb/components/MgtPage.svelte';
	import Wysiwyg from '$sitb/components/wysiwyg/Wysiwyg.svelte';
	import type { TradDictionary } from '$sitb/intl';

	export let data: PageData;
	let dictionary: TradDictionary[] = data.transls;
	const { Table, Column, RoColumn } = cellEditTable<TradDictionary>()
	let reference: LangItem[],
		work: LangItem[];
	function nonKey(ref: LangItem[]): LangItem[]
	{ return ref.filter(r=> r.id !== 'key'); }
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

	async function saveCB(old: TradDictionary, diff: Partial<TradDictionary>) {
		const rv = await ajax.patch({key: old.key, diff});
		if(!rv.ok) throw new NotSaved(await rv.text());
	}

	let modaled: TradDictionary|undefined = undefined;
	/*
	- save
	*/
</script>
<MgtPage title="ttl.translations">
	<svelte:fragment slot="config">
		<Button circular icon="cog" />
		<Popup on="click" wide="very">
			<LngConfig {config} />
		</Popup>
	</svelte:fragment>
	<Table class="attached" compact="very" {saveCB} celled striped selectable key="key" data={dictionary} columnFilters let:model>
		{#each reference as lng (lng.id)}
			<RoColumn name={lng.id} title="" {model}>
				<Th collapsing class="prefix-icon" slot="header">
					<i class={lng.icon}></i>{lng.text}
				</Th>
				<StringContent slot="filter" />
			</RoColumn>
		{/each}
		{#each work as lng (lng.id)}
			<Column name={lng.id} {html} {getDisplay} {model}>
				<Th class="prefix-icon" slot="header">
					<i class={lng.icon}></i>{lng.text}
				</Th>
				<StringContent slot="filter" />
				<Text type="area" placeholder="" {model} />
			</Column>
		{/each}
		<RoColumn {model} let:model>
			<th class="collapsing" slot="header" />
			<Td>
				<Button tiny on:click={()=> modaled = model} primary={model?.type === 'html'} icon="external alternate" />
			</Td>
		</RoColumn>
		<ModalEdit slot="modal" bind:model={modaled}>
			<h1 slot="header">
				{modaled?.key}
			</h1>
			<Accordion exclusive={false}>
				{#each nonKey(reference) as lng (lng.id)}
					<Page key={lng.id}>
						<svelte:fragment slot="header">
							<Flag code={lng.icon} /> {lng.text}
						</svelte:fragment>
						{#if modaled?.type === 'html'}
							{@html modaled?.[lng.id]}
							<input type="hidden" name={lng.id} />
						{:else}
							<Field name={lng.id}><Input readonly type="area" placeholder="" /></Field>
						{/if}
					</Page>
				{/each}
				{#each work as lng (lng.id)}
					<Page active key={lng.id}>
						<svelte:fragment slot="header">
							<Flag code={lng.icon} /> {lng.text}
						</svelte:fragment>
						{#if modaled?.type === 'html'}
							<Wysiwyg name={lng.id} value={modaled?.[lng.id]} />
						{:else}
							<Field name={lng.id}><Input type="area" placeholder="" /></Field>
						{/if}
					</Page>
				{/each}
			</Accordion>
			<Buttons slot="actions">
				<Button tiny submit primary icon="save" />
				<Button tiny cancel color="yellow" icon="times" />
			</Buttons>
		</ModalEdit>
	</Table>
</MgtPage>
<style lang="scss">
	.prefix-icon i { margin-right: .5em; }
</style>