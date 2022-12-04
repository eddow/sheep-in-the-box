<script lang="ts">
	import Horizontal from "$lib/components/dnd/Horizontal.svelte";
	import Column from "$lib/components/table/edition/cell/Column.svelte";
	import RoColumn from "$lib/components/table/Column.svelte";
	import StringContent from "$lib/components/table/filters/StringContent.svelte";
	import Text from "$lib/components/table/edition/Text.svelte";
	import { languages, flag } from "$lib/constants";
	import { ajax, T } from "$lib/globals";
	import { preferences, user } from "$lib/user";
	import { Button, Card, CardBody, CardHeader, CardTitle, Col, Container, Icon, Row } from "sveltestrap";
	import type { PageData } from "./$types";
	import Table from "$lib/components/table/Table.svelte";
	import { string } from "yup";

	export let data: PageData;
	const dictionary = data.transls;

	/// #region Configuration

	interface LangItem {
		id: string;
		icon: string;
	}
	let prefs = $preferences;
$:	prefs = $preferences;
	if(!prefs.tradLngs) prefs.tradLngs = 'key:' + $user.language;
	const [refs, work] = prefs.tradLngs.split(':').map((x: string)=> x.split('.').filter(x=>x)),
		used = refs.concat(work),
		allItems: LangItem[] = [{id: 'key', icon: 'bi-key'}].concat(Object.keys(languages).map(id=> ({id, icon: flag(id)}))),
		groups = [
			{id: 'unused', noDrop: false, items: allItems.filter((x: LangItem)=> !~used.indexOf(x.id))},
			{id: 'refs', noDrop: false, items: allItems.filter((x: LangItem)=> ~refs.indexOf(x.id))},
			{id: 'work', noDrop: false, items: allItems.filter((x: LangItem)=> ~work.indexOf(x.id))}
		], groupIdx: Record<string, number> = {unused: 0, refs: 1, work: 2};
	function reordered(group: string, detail: any) {
		groups[groupIdx[group]].items = detail.items;
		if(group !== 'unused') refreshPrefs();
	}
	let refreshingPrefs = false;
	function grpKeys(ndx: number) {
		return groups[ndx].items.map(li=> li.id).join('.');
	}
	function refreshPrefs() {
		if(refreshingPrefs) return;
		refreshingPrefs = true;
		setTimeout(()=> {
			refreshingPrefs = false;
			prefs.tradLngs = grpKeys(1)+':'+grpKeys(2)
		}, 100);
	}
	function setAvailableZones(id: string) {
		groups[2].noDrop = id === 'key';
	}
	let confOpened = false;

	/// #endregion
	/// #region Table

	const type = string();
	let clmnTitles: Record<string, string>;
$:	clmnTitles = {key: $T('fld.key'), ...languages};

	function html(value?: string) {
		return typeof value === 'undefined';
	}
	function getDisplay(value?: string) {
		return typeof value === 'undefined' ?
			'<i class="bi bi-slash-circle"></i>' :
			value;
	}

	/// #endregion
</script>
<div style="width: 100%">
	<Button id="configure" on:click={()=> confOpened = !confOpened} class="btn-rounded"><Icon name="gear-fill" /></Button>
	{#if confOpened}
		<Container>
			<Row>
				{#each groups as group(group.id)}
					<Col md="4">
						<Card>
							<CardHeader><CardTitle>{$T('fld.trad.grp.'+group.id)}</CardTitle></CardHeader>
							<CardBody>
								<Horizontal style="height: 1.5em" items={group.items} let:item
									dropFromOthersDisabled={group.noDrop}
									itemWidth="2em" on:reordered={({detail})=> reordered(group.id, detail)}
								>
									<i class={item.icon} on:mousedown={()=> setAvailableZones(item.id)}></i>
								</Horizontal>
							</CardBody>
						</Card>
					</Col>
				{/each}
			</Row>
		</Container>
	{/if}
	<h1>
		{$T('ttl.translations')}
	</h1>
</div>

<Table key="key" data={dictionary} columnFilters>
	{#each groups[1].items as lng (lng.id)}
		<RoColumn headers={lng.id === 'key'} prop={lng.id} title="">
			<div class="th prefix-icon" slot="header">
				<i class={lng.icon}></i>{clmnTitles[lng.id]}
			</div>
			<StringContent slot="filter" />
		</RoColumn>
	{/each}
	{#each groups[2].items as lng (lng.id)}
		<Column headers={lng.id === 'key'} prop={lng.id} {type}>
			<div class="th prefix-icon" slot="header">
				<i class={lng.icon}></i>{clmnTitles[lng.id]}
			</div>
			<StringContent slot="filter" />
			<Text {html} {getDisplay} placeholder="" />
		</Column>
	{/each}
	<!--
	<Column prop="text" title={$T('fld.text')}>
		<StringContent slot="filter" />
		<Text area />
	</Column>
	<Column prop="role" title={$T('fld.role')}>
		<Select options={textRoles} />
	</Column>
	<Column prop="type" title={$T('fld.type')}>
		<Select options={textTypes} />
	</Column-->
</Table>