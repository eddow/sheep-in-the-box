<script lang="ts">
	import Column from "$lib/components/table/edition/cell/Column.svelte";
	import RoColumn from "$lib/components/table/Column.svelte";
	import StringContent from "$lib/components/table/filters/StringContent.svelte";
	import Text from "$lib/components/table/edition/Text.svelte";
	import { ajax, T } from "$lib/globals";
	import { preferences, user } from "$lib/user";
	import { Button, Icon, Modal } from "sveltestrap";
	import type { PageData } from "./$types";
	import Table from "$lib/components/table/Table.svelte";
	import { string } from "yup";
	import Zoom from "./zoom.svelte";
	import LngConfig, { type LangItem } from "../lngConfig.svelte";

	export let data: PageData;
	let dictionary = data.transls;

	let prefs = $preferences;
$:	prefs = $preferences;
	let confHidden = true;
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
			'<i class="bi bi-slash-circle"></i>' :
			value;
	}

	async function saveCB(language: string, text: string, row: any) {
		if(row[language] !== text)
			return await ajax.patch({key: row.key, diff: {[language]: text}});
	}

	let modaled: any = null, saving = false;
	async function saveModal({detail}: CustomEvent) {
		const values = detail.values;
		saving = true;
		try {
			const diff: Record<string, string> = {};
			for(const lng in values) if(values[lng] !== modaled[lng]) diff[lng] = values[lng];
			if(Object.keys(diff).length) {
				await ajax.patch({key: modaled.key, diff});
				Object.assign(modaled, diff);
				dictionary = dictionary;
			}
			modaled = null;
		} finally {
			saving = false;
		}
	}
</script>
<div style="width: 100%">
	<Button id="configure" on:click={()=> confHidden = !confHidden} class="btn-rounded"><Icon name="gear-fill" /></Button>
	<LngConfig bind:configuration={prefs.tradLngs} {config} hide={confHidden} />
	<h1>
		{$T('ttl.translations')}
	</h1>
</div>
<Table key="key" data={dictionary} columnFilters let:row>
	{#each reference as lng (lng.id)}
		<RoColumn headers={lng.id === 'key'} prop={lng.id} title="" {row}>
			<div class="th prefix-icon" slot="header">
				<i class={lng.icon}></i>{lng.text}
			</div>
			<StringContent slot="filter" />
		</RoColumn>
	{/each}
	{#each work as lng (lng.id)}
		<Column prop={lng.id} {type} {saveCB} {row} let:value>
			<div class="th prefix-icon" slot="header">
				<i class={lng.icon}></i>{lng.text}
			</div>
			<StringContent slot="filter" />
			<Text {html} {getDisplay} placeholder="" {value} />
		</Column>
	{/each}
	<RoColumn {row}>
		<div class="td">
			<Button class="xs" size="sm" type="button" on:click={()=> modaled = row} color="secondary"><Icon name="box-arrow-up-left" /></Button>
		</div>
	</RoColumn>
</Table>
<Modal keyboard={true} size="xl" isOpen={modaled}>
	<Zoom model={modaled} on:cancel={()=> modaled = null} on:save={saveModal} {reference} {work} {saving} />
</Modal>