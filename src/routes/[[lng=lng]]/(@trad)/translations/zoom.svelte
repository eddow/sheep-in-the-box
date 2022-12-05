<script lang="ts">
	import Form from "$lib/components/form/Form.svelte";
	import Column from "$lib/components/table/Column.svelte";
	import Table from "$lib/components/table/Table.svelte";
	import Text from "$lib/components/table/edition/Text.svelte";
	import { Button, Icon, ModalBody, ModalFooter, ModalHeader, Spinner } from "sveltestrap";
	import { T } from "$lib/globals";
	import { createEventDispatcher } from "svelte";
	import type { LangItem } from "../lngConfig.svelte";
	import { object, string, type ObjectSchema } from "yup";
	import { Editing, setEdtnCtx } from "$lib/components/table/edition/utils";
	import { privateStore } from "$lib/privateStore";
	import Preview from "$lib/components/Preview.svelte";
	import Code from "$lib/components/table/edition/Code.svelte";

	const dispatch = createEventDispatcher();
	export let model: any, saving: boolean,
		reference: LangItem[], work: LangItem[];
	let nonKeyRef: LangItem[];
$:	nonKeyRef = reference.filter(r=> r.id !== 'key');
	let schema: ObjectSchema<any>;
$:	schema = object(work.reduce((ttl: any, cur: LangItem)=> ({...ttl, [cur.id]: string()}), {}));
	setEdtnCtx({
		editing: privateStore(Editing.Yes).store,
		schema
	});
	let previewed: Record<string, boolean> = {}
	function preview(lng: LangItem) {
		previewed[lng.id] = !previewed[lng.id];
	}
</script>
<Form {schema} on:submit={({detail})=> dispatch('save', detail)}>
	<ModalHeader>{model.key}</ModalHeader>
	<ModalBody>
		<Table key="key" data={[model]} let:row>
			{#each nonKeyRef as lng (lng.id)}
				<Column prop={lng.id} title="" let:value {row}>
					<div class="th prefix-icon" slot="header">
						<i class={lng.icon}></i>{lng.text}
					</div>
					<Preview type={model.type} text={value} />
				</Column>
			{/each}
			{#each work as lng (lng.id)}
				<Column prop={lng.id} let:value {row}>
					<div class="th" slot="header">
						{#if model.type}
							<Button size="sm" type="button" color={previewed[lng.id]?'info':'secondary'} on:click={()=> { preview(lng); }}>
								<Icon name="eye" />
							</Button>
						{/if}
						<span class="prefix-icon"><i class={lng.icon}></i>{lng.text}</span>
					</div>
					<Code style="height: 50vh;" preview={previewed[lng.id] ? model.type : ''} {value} />
				</Column>
			{/each}
		</Table>
	</ModalBody>
	<ModalFooter>
		{#if saving}<Spinner size="sm" />{:else}
			<Button type="reset" class="prefix-icon" color="secondary" on:click={()=> dispatch('cancel')}><Icon name="x-lg" />{$T('cmd.cancel')}</Button>
			<Button type="submit" class="prefix-icon" color="primary"><Icon name="save" />{$T('cmd.save')}</Button>
		{/if}
	</ModalFooter>
</Form>