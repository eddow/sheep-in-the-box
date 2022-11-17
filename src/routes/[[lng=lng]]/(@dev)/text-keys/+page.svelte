<script lang="ts">
	import Edition from "$lib/components/Table/edition/Edition.svelte";
	import Text from "$lib/components/Table/edition/Text.svelte";
	import Table from "$lib/components/Table/edition/Table.svelte";
	import StringContent from "$lib/components/Table/filters/StringContent.svelte";
	import type { PageData } from "./$types";
	import Select from "$lib/components/Table/edition/Select.svelte";
	import { roles } from "$lib/constants";
	import { language, T, ajax, alert } from "$lib/globals";
	import { Button, Icon } from "sveltestrap";

	export let data: PageData;
	let textRoles: any[];
$:	textRoles = ['', 'lgdn'].concat(roles).map(r=> ({value: r, text: $T('role.'+(r||'none'))}));
	async function save(e: CustomEvent) {
		e.preventDefault();
		const {diff, row, old, effect, cancel} = e.detail;
		if(!row.key) {
			$alert({message: $T('err.key.no'), color: 'danger'});
			cancel();
			return;
		}
		if(diff.key && old.key) {
			const rv = await ajax.put({oldK: old.key, newK: row.key});
			if(!rv.ok) return cancel();
		}
		if(diff.hasOwnProperty('text') || diff.hasOwnProperty('role')) {
			const chg: any = {key: row.key, language: $language};
			if(diff.hasOwnProperty('text')) chg.text = diff.text;
			if(diff.hasOwnProperty('role')) chg.role = diff.role;
			const rv = await ajax[old.key?'patch':'post'](chg);
			if(rv.ok) effect(); else cancel();
		} else effect();
	}
	async function remove(e: CustomEvent) {
		const {row, effect, cancel} = e.detail;
		e.preventDefault();
		let rv = await ajax.delete({key: row.key});
		if(rv.ok) effect(); else cancel();
	}
	function preview(row: any) {
		// TODO Preview
	}
	// TODO Edit boolean `template`
</script>
<Table data={data.dictionary}>
	<Text prop="key" title={$T('fld.key')} required>
	</Text>
	<Text autofocus prop="text" area title={$T('fld.text')} />
	<Select prop="role" title={$T('fld.role')} options={textRoles} />
	<Edition on:save={save} on:remove={remove} create="both" edition="both">
		<svelte:fragment slot="row" let:row={row}>
			{#if row.template}<Button color="info" on:click={()=> preview(row)}><Icon name="eye" /></Button>{/if}
		</svelte:fragment>
		<svelte:fragment slot="dialog" let:row={row}>
			{#if row.template}<Button color="info" on:click={()=> preview(row)}><Icon name="eye" />{$T('cmd.preview')}</Button>{/if}
		</svelte:fragment>
	</Edition>
</Table>