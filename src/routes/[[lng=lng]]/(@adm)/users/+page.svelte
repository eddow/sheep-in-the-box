<script lang="ts">
	import Edition from "$sitb/components/table/edition/row/Edition.svelte";
	import Text from "$sitb/components/table/edition/editor/Text.svelte";
	import StringContent from "$sitb/components/table/filters/StringContent.svelte";
	import { ajax, I } from "$sitb/globals";
	import Select from "$sitb/components/table/edition/editor/Select.svelte";
	import type { PageData } from "./$types";
	import { roles, type UserSys } from "$sitb/constants";
	import type { DropdownOption } from "svemantic";
	import { rowEditTable } from "$sitb/components/table/collections";
	import MgtPage from "$sitb/components/MgtPage.svelte";

	const { Table, Column } = rowEditTable<UserSys>()

	export let data: PageData;
	let users = data.users;

	let options: DropdownOption[];
$:	options = roles.map(r=> ({value: r, text: $I('role.'+r)}));
	async function saveCB(old: any, diff: any) {
		await ajax.patch({...diff, _id: old._id});
	}
</script>
<MgtPage title="ttl.users">
	<Table key="_id" data={users} columnFilters {saveCB}>
		<Column name="email" title={$I('fld.email')}>
			<StringContent slot="filter" />
			<Text />
		</Column>
		<Column name="roles" title={$I('fld.role')}>
			<Select multiple {options} delimiter=" " />
		</Column>
		<Edition edition="row" />
	</Table>
</MgtPage>