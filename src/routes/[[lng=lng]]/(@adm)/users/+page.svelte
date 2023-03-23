<script lang="ts">
	import Edition from "$sitb/components/table/edition/row/Edition.svelte";
	import Text from "$sitb/components/table/edition/Text.svelte";
	import Table from "$sitb/components/table/edition/row/Table.svelte";
	import StringContent from "$sitb/components/table/filters/StringContent.svelte";
	import { ajax, I } from "$sitb/globals";
	import Select from "$sitb/components/table/edition/Select.svelte";
	import type { PageData } from "./$types";
	import { object, string } from "yup";
	import Column from "$sitb/components/table/Column.svelte";
	import { roles } from "$sitb/constants";
	import type { DropdownOption } from "svemantic";

	export let data: PageData;
	let users = data.users;

	const schema = object({
		email: string().required(),
		roles: string()
	});
	let options: DropdownOption[];
$:	options = roles.map(r=> ({value: r, text: $I('role.'+r)}));
	async function saveCB(row: any, old: any, diff: any) {
		await ajax.patch({...diff, _id: old._id});
	}
</script>
<h1 class="ui top attached centered block header">
	{$I('ttl.users')}
</h1>
<Table key="_id" {schema} data={users} columnFilters {saveCB}>
	<Column prop="email" title={$I('fld.email')} let:value>
		<StringContent slot="filter" />
		<Text {value}  />
	</Column>
	<Column prop="roles" title={$I('fld.role')} let:value>
		<Select multiple {value} {options} delimiter=" " />
	</Column>
	<Edition edition="row" />
</Table>