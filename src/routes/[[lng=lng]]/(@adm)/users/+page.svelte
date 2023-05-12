<script lang="ts">
	import Text from "$sitb/components/table/edition/editor/Text.svelte";
	import StringContent from "$sitb/components/table/filters/StringContent.svelte";
	import { I } from "$sitb/intl";
	import { ajax } from "$sitb/ajax";
	import Select from "$sitb/components/table/edition/editor/Select.svelte";
	import type { PageData } from "./$types";
	import { roles } from "$sitb/constants";
	import type { DropdownOption } from "svemantic";
	import { rowEditTable } from "$sitb/components/table/collections";
	import MgtPage from "$sitb/components/MgtPage.svelte";
	import type User from "$sitb/entities/user";

	const { Table, Column, Edition } = rowEditTable<User>()

	export let data: PageData;
	let users = data.users;

	let options: DropdownOption[];
	$: options = roles.map(r=> ({value: r, text: $I('role.'+r)}));
	async function saveCB(old: any, diff: any) {
		await ajax.patch({diff, email: old.email});
	}
</script>
<MgtPage title="ttl.users">
	<Table key="email" data={users} columnFilters {saveCB}>
		<Column name="email">
			<StringContent slot="filter" />
			<Text />
		</Column>
		<Column name="roles">
			<Select {options} multiple delimiter="|" />
		</Column>
		<Edition edition="row" />
	</Table>
</MgtPage>