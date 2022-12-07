<script lang="ts" context="module">
	export interface LangItem {
		id: string;
		icon: string;
		text: string;
	}
</script>
<script lang="ts">
	import Horizontal from "$lib/components/dnd/Horizontal.svelte";
	import { flag, languages } from "$lib/constants";
	import { T, user } from "$lib/globals";
	import { Card, CardBody, CardHeader, CardTitle, Col, Container, Row } from "sveltestrap";

	export let configuration: string;
	const [ref, wrk] = configuration.split(':').map((x: string)=> x.split('.').filter(x=>x)),
		used = ref.concat(wrk),
		allItems: LangItem[] = [{id: 'key', icon: 'bi-key', text: $T('fld.key')}].concat(Object.keys(languages).map(id=> ({id, icon: flag(id), text: languages[id]}))),
		groups = [
			{id: 'unused', noDrop: false, items: allItems.filter((x: LangItem)=> !used.includes(x.id))},
			{id: 'ref', noDrop: false, items: allItems.filter((x: LangItem)=> ref.includes(x.id))},
			{id: 'work', noDrop: false, items: allItems.filter((x: LangItem)=> wrk.includes(x.id))}
		], groupIdx: Record<string, number> = {unused: 0, ref: 1, wrk: 2};

	// Callback instead of dispatch to make sure the call is made on-init and the parent has no tick() while uninitialized
	export let config: (cnf: {reference: LangItem[], work: LangItem[]})=> void;
	let refreshingOutp = false;
	function outputGroups() {
		refreshingOutp = false;
		configuration = grpKeys(1)+':'+grpKeys(2);
		config({reference: groups[1].items, work: groups[2].items});
	}
	if(!configuration) configuration = 'key:' + $user.language;
	outputGroups();

$:	allItems[0].text = $T('fld.key');

	function reordered(group: string, detail: any) {
		groups[groupIdx[group]].items = detail.items;
		if(group !== 'unused' && !refreshingOutp) {
			refreshingOutp = true;
			setTimeout(outputGroups, 100);
		}
	}
	function grpKeys(ndx: number) {
		return groups[ndx].items.map(li=> li.id).join('.');
	}
	function refreshPrefs() {
	}
	function setAvailableZones(id: string) {	// Test on:mousemove to avoid the few misses on:mousedown
		groups[2].noDrop = id === 'key';
	}
	export let hide = false;
</script>
{#if !hide}
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
								<i class={item.icon} on:mousemove={()=> setAvailableZones(item.id)}></i>
							</Horizontal>
						</CardBody>
					</Card>
				</Col>
			{/each}
		</Row>
	</Container>
{/if}