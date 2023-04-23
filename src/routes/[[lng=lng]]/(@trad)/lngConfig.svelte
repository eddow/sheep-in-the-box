<script lang="ts" context="module">
	type LangId = Language | 'key';
	export interface LangItem {
		id: LangId;
		icon: string;
		text: string;
	}
	const { Table, Column } = displayTable<true>();
</script>
<script lang="ts">
	import Horizontal from "$sitb/components/dnd/Horizontal.svelte";
	import { flag, languages, type Language, type LanguageDesc } from "$sitb/constants";
	import { I, user } from "$sitb/globals";
	import { preference, Side } from "$sitb/preferences";
	import { displayTable } from '$sitb/components/table/collections';
	
	const tradLngs = preference('tradLngs', Side.server),
		allItems: LangItem[] = [{id: <LangId>'key', icon: 'key icon', text: $I('fld.key')}]
			.concat((<[Language, LanguageDesc][]>Object.entries(languages)).map(([id, {text}])=> ({id, icon: flag(id)+' flag', text}))),
		groupIdx: Record<string, number> = {unused: 0, ref: 1, work: 2};
	const [ref, wrk] = $tradLngs ?
		$tradLngs.split(':').map((x: string)=> x.split('.').filter(x=>x)) :
		[['key'], [$user.language]];
	const used = ref.concat(wrk), groups = [
		{id: 'unused', noDrop: false, items: allItems.filter((x: LangItem)=> !used.includes(x.id))},
		{id: 'ref', noDrop: false, items: allItems.filter((x: LangItem)=> ref.includes(x.id))},
		{id: 'work', noDrop: false, items: allItems.filter((x: LangItem)=> wrk.includes(x.id))}
	];
	// Callback instead of dispatch to make sure the call is made on-init and the parent has no tick() while uninitialized
	export let config: (cnf: {reference: LangItem[], work: LangItem[]})=> void;
	let refreshingOutp = false;
	function outputGroups() {
		refreshingOutp = false;
		$tradLngs = [groups[1], groups[2]].map(g=> g.items.map(g=> g.id).join('.')).join(':');
		config({reference: groups[1].items, work: groups[2].items});
	}
	outputGroups();

$:	allItems[0].text = $I('fld.key');

	function reordered(group: string, detail: any) {
		groups[groupIdx[group]].items = detail.items;
		if(group !== 'unused' && !refreshingOutp) {
			refreshingOutp = true;
			setTimeout(outputGroups, 100);
		}
	}
	function setAvailableZones(id: string) {	// Test on:mousemove to avoid the few misses on:mousedown
		groups[2].noDrop = id === 'key';
	}
</script>
<Table data={[true]}>
	{#each groups as group(group.id)}
		<Column>
			<th slot="header" class="flags">{$I('fld.trad.grp.'+group.id)}</th>
			<td>
				<Horizontal style="height: 1.5em" items={group.items} let:item
					dropFromOthersDisabled={group.noDrop}
					itemWidth="2em" on:reordered={({detail})=> reordered(group.id, detail)}
				>
					<i class={item.icon} on:mousemove={()=> setAvailableZones(item.id)}></i>
				</Horizontal>
			</td>
		</Column>
	{/each}
</Table>
<style lang="scss">
	th.flags {
		width: 12em;
	}
</style>