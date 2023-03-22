<script lang="ts">
	import Edition from "$sitb/components/table/edition/row/Edition.svelte";
	import Text from "$sitb/components/table/edition/Text.svelte";
	import Table from "$sitb/components/table/edition/row/Table.svelte";
	import StringContent from "$sitb/components/table/filters/StringContent.svelte";
	import { ajax, T } from "$sitb/globals";
	import { Button, Icon, Modal } from "sveltestrap";
	import type { PageData } from "./$types";
	import { object, string } from "yup";
	import Column from "$sitb/components/table/Column.svelte";
	import MultiSelect from "$sitb/components/table/edition/MultiSelect.svelte";
	import { roles } from "$sitb/constants";
	import type { Option } from "$sitb/components/form/MultiSelect.svelte";

	export let data: PageData;
	let users = data.users;

	const schema = object({
		email: string().required(),
		roles: string()
	});
	let options: Option[];
$:	options = roles.map(r=> ({value: r, text: $T('role.'+r)}));
	async function saveCB(row: any, old: any, diff: any) {
		await ajax.patch({...diff, _id: old._id});
	}
</script>
<Table key="_id" {schema} data={users} columnFilters {saveCB} let:row>
	<Column prop="email" title={$T('fld.email')} let:value>
		<StringContent slot="filter" />
		<Text {value}  />
	</Column>
	<Column prop="roles" title={$T('fld.role')} let:value>
		<MultiSelect {value} {options} />
	</Column>
	<Edition edition="row" />
</Table>