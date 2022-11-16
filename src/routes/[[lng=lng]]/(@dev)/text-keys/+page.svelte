<script lang="ts">
	import Edition from "$lib/components/Table/edition/Edition.svelte";
	import Text from "$lib/components/Table/edition/Text.svelte";
	import Table from "$lib/components/Table/edition/Table.svelte";
	import type { PageData } from "./$types";
	import Select from "$lib/components/Table/edition/Select.svelte";
	import { roles } from "$lib/constants";
	import { language, T } from "$lib/intl";
	import { getContext } from "svelte";

	export let data: PageData;
	const alert = <(a: AlertSpec)=> void>getContext('alert');
	let textRoles: any[];
$:	textRoles = ['', 'cust'].concat(roles).map(r=> ({value: r, text: $T('role.'+(r||'none'))}));
	async function save(e: CustomEvent) {
		e.preventDefault();
		const {diff, row, old, effect, cancel} = e.detail;
		if(!row.key) {
			alert({message: $T('err.no-key'), color: 'danger'});
			cancel();
			return;
		}
		if(diff.key && old.key) {
			const rv = await fetch('', {
				method: 'PUT',
				body: JSON.stringify({oldK: old.key, newK: row.key})
			});
			if(!rv.ok) return cancel();
		}
		if(diff.hasOwnProperty('text') || diff.hasOwnProperty('role')) {
			const chg: any = {key: row.key, language: $language};
			if(diff.hasOwnProperty('text')) chg.text = diff.text;
			if(diff.hasOwnProperty('role')) chg.role = diff.role;
			const rv = await fetch('', {
				method: old.key?'PATCH':'POST',
				body: JSON.stringify(chg)
			});
			if(rv.ok) effect(); else cancel();
		}
	}
	async function remove(e: CustomEvent) {
		const {row, effect, cancel} = e.detail;
		e.preventDefault();
		let rv = await fetch('', {
			method: 'DELETE',
			body: JSON.stringify({key: row.key})
		});
		if(rv.ok) effect(); else cancel();
	}
</script>
<Table data={data.dictionary}>
	<Text prop="key" title="Key" required />
	<Text autofocus prop="text" area title="Text" />
	<Select prop="role" title="Role" options={textRoles} />
	<Edition on:save={save} on:remove={remove} create="both" edition="both" />
</Table>