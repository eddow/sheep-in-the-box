<script lang="ts" context="module">
	let count = 0;
	function getUniqueId() { return 'upl'+(++count); }
</script>
<script lang="ts">
	import { Field, Input, Grid, Col, Button, ModalForm, Loader, Popup, NotSaved } from 'svemantic';
	import { FileUploadWithPreview, Events } from 'file-upload-with-preview';
	import { createEventDispatcher, onMount } from 'svelte';
	import { ajax } from '$sitb/ajax';
	import { browser } from '$app/environment';
	import { I } from '$sitb/intl';
	import { slugify } from '$sitb/utils';

	const dispatch = createEventDispatcher();

	interface ImgDesc {
		name: string;
	}

	const uid = getUniqueId();
	let uploader: FileUploadWithPreview, editedPicture: ImgDesc|undefined = undefined, canAdd = false, adding = 0;
	export let article: string, list: string[];
	onMount(()=> {
		uploader = new FileUploadWithPreview(uid, {
			multiple: true
		});
		// TODO: text { chooseFile: 'Choose file...', browse: 'Browse', label: 'Upload', selectedCount: 'files selected' }
		
	});
	function checkAdd() { canAdd = !!uploader.cachedFileArray.length }
	if(browser) {
		window.addEventListener(Events.IMAGE_ADDED, checkAdd);
		window.addEventListener(Events.IMAGE_DELETED, checkAdd);
		window.addEventListener(Events.CLEAR_BUTTON_CLICKED, checkAdd);
		window.addEventListener(Events.IMAGE_MULTI_ITEM_CLICKED, checkAdd);
	}

	function upload() {
		adding = uploader.cachedFileArray.length;
		for(const image of uploader.cachedFileArray) {
			const body = {type: image.type, name: slugify(image.name.split('.')[0])};
			const reader = new FileReader();
			reader.readAsDataURL(image);
			reader.onload = async (e) => {
				const b64 = <string>e.target!.result, cNdx = b64.indexOf(',');
				let rv = await ajax.post({
					...body,
					content: b64.substring(cNdx+1)
				}, '/raw/'+article);
				list = [...list, (await rv.json()).name];
				--adding;
			};
		}
		uploader.resetPreviewPanel();
		canAdd = false;
	}
	//let t: MouseEventHandler;
	function imgClick(e: MouseEvent) {
		e.preventDefault();
		const name = (<any>e.currentTarget).getAttribute('href').split('/').pop();
		editedPicture = {name};
		slugified = slugify(name);
		return false;
	}
	function moveImg(newName?: string) {
		const
			name = editedPicture!.name,
			ndx = list.indexOf(name);
		console.assert(~ndx, 'Remove present image');
		list = [...list.slice(0, ndx), ...(newName?[newName]:[]), ...list.slice(ndx+1)];
		dispatch(newName?'rename':'delete', {name, ...(newName?{newName}:{})});
		editedPicture = undefined;
	}
	async function deleteImg() {
		await ajax.delete({name: editedPicture!.name}, '/raw/'+article);
		moveImg();
	}
	async function save(img: ImgDesc) {
		if(slugified !== editedPicture!.name) {
			if(list.includes(slugified)) throw new NotSaved($I('err.already-name'));
			const rv = await ajax.patch({name: editedPicture!.name, newName: slugified}, '/raw/'+article, [400]);
			if(rv.status === 400) throw new NotSaved($I('err.already-name'));
			moveImg(slugified);
		}
	}
	let newName: string, slugified: string;
	$: slugified = newName && slugify(newName);
</script>
<svelte:head>
	<link rel="stylesheet" href="/node_modules/file-upload-with-preview/dist/style.css" />
</svelte:head>
<Grid stackable doubling>
	<Col eight>
		<div class="custom-file-container" data-upload-id={uid}>
			<Loader inverted loading={!!adding} />
		</div>
		<Button fluid primary on:click={upload} disabled={!canAdd} icon="add">Add</Button>
	</Col>
	<Col eight>
		TODO
		<ul>
			<li>Manage trash</li>
			<li>Garbage collector</li>
			<li>Borrow from other articles</li>
		</ul>
	</Col>
</Grid>
<div class="ui cards">
	{#each list as img (img)}
		<div class="ui card">
			<a href={`/${article}/${img}`} target="_blank" rel="noreferrer" on:click={imgClick} class="image">
				<img src={`/${article}/${img}?256`} alt={img}>
			</a>
			<div class="content">{img}</div>
		</div>
	{/each}
</div>
<ModalForm large model={editedPicture} save={save}>
	<Field name="name" validate="regExp[/^[\w-]*$/]">
		<Input bind:value={newName}>
			<svelte:fragment slot="left-action">
				<Button negative icon="trash alternate outline">{$I('cmd.delete')}</Button>
				<Popup on="click">
					<div class="header">{$I('msg.delete')}</div>
					<Button negative icon="trash alternate outline" on:click={deleteImg}>{$I('cmd.delete')}</Button>
				</Popup>
				<Button primary submit icon="edit">{$I('cmd.rename')}</Button>
			</svelte:fragment>
			<span slot="postfix" class="ui tag label">{slugified}</span>
		</Input>
	</Field>
	<div class="image-preview">
		{#if editedPicture}
			<img src={`/${article}/${editedPicture?.name}`} alt={editedPicture?.name}>
		{/if}
	</div>
</ModalForm>
<style lang="scss">
	.image-preview {
		overflow-y: auto;
		max-height: 70vh;
		img {
			width: 100%;
		}
	}
</style>