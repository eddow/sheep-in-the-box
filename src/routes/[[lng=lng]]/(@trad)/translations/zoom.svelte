<script lang="ts">
	import { Buttons, Button, ModalForm, type ModalSaveFunction } from "svemantic";
	import { T } from "$sitb/globals";
	import type { LangItem } from "../lngConfig.svelte";
	import { Editing, setEdtnCtx } from "$sitb/components/table/edition/utils";
	import { privateStore } from "$sitb/privateStore";
	import Preview from "$sitb/components/Preview.svelte";
	import Code from "$sitb/components/table/edition/Code.svelte";
	import { displayTable } from "$sitb/components/table/collections";

	const { Table, Column } = displayTable<DictionaryEntry>();
	export let save: ModalSaveFunction, model: DictionaryEntry|undefined, reference: LangItem[], work: LangItem[];
	let nonKeyRef: LangItem[], reducedModel: Partial<DictionaryEntry>|undefined = undefined;
$:	nonKeyRef = reference.filter(r=> r.id !== 'key');
$:	reducedModel =model &&  work.map(lng=> lng.id).reduce((p, c)=> ({...p, [c]: model[c]}), {});
	setEdtnCtx({
		editing: privateStore(Editing.Yes).store
	});
	
	let previewed: Record<string, boolean> = {}
	function preview(lng: LangItem) {
		previewed[lng.id] = !previewed[lng.id];
	}
</script>
<ModalForm fullscreen bind:save model={reducedModel}>
	<svelte:fragment slot="header">{model?.key}</svelte:fragment>
	<Table key="key" data={model?[model]:[]} let:row>
		{#each nonKeyRef as lng (lng.id)}
			<Column prop={lng.id} title="" let:value>
				<div class="th prefix-icon" slot="header">
					<i class={lng.icon}></i>{lng.text}
				</div>
				<Preview type={model?.type} text={value} />
			</Column>
		{/each}
		{#each work as lng (lng.id)}
			<Column prop={lng.id} let:value>
				<div class="th" slot="header">
					{#if model?.type}
						<Button small primary={previewed[lng.id]} on:click={()=> { preview(lng); }} icon=eye />
					{/if}
					<span class="prefix-icon"><i class={lng.icon}></i>{lng.text}</span>
				</div>
				<Code style="height: 50vh;" preview={previewed[lng.id] ? model?.type : ''} {value} />
			</Column>
		{/each}
	</Table>
	<Buttons slot="actions">
		<Button cancel class="prefix-icon" icon="times">{$T('cmd.cancel')}</Button>
		<Button submit class="prefix-icon" primary icon="save outline">{$T('cmd.save')}</Button>
	</Buttons>
</ModalForm>