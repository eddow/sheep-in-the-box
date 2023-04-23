<script lang="ts">
	import { Field, Input, Grid, Col, Button, ModalForm, Loader, Popup, NotSaved } from 'svemantic';
	import { createEventDispatcher, onMount } from 'svelte';
	import { ajax } from '$sitb/ajax';
	import { I, language } from '$sitb/intl';
	import { slugify } from '$sitb/utils';

    import { Dashboard } from '@uppy/svelte';
    import Uppy, { type UppyFile } from '@uppy/core';
    import Webcam from '@uppy/webcam';
	import ImageEditor from '@uppy/image-editor';
	import XHR from '@uppy/xhr-upload';
    import '@uppy/core/dist/style.css';
    import '@uppy/dashboard/dist/style.css';
    import '@uppy/webcam/dist/style.css';
	import '@uppy/image-editor/dist/style.min.css';

    let uppy: Uppy|null = null;
	const locales = {fr: 'fr_FR', en: 'en_US', ro: 'ro_RO'};

	const
		props = {
			proudlyDisplayPoweredByUppy : false
		},
		plugins = ["Webcam", "ImageEditor", "XHR"],
		dispatch = createEventDispatcher();

	interface ImgDesc {
		name: string;
	}

	let editedPicture: ImgDesc|undefined = undefined;
	export let
	/**
	 * @param {string} Url used to edit pictures.
	 * Used to build the following routes:
	 * - GET [endpoint]/[name] to get a picture
	 * - POST [endpoint] to upload a picture
	 * - DELETE [endpoint]/[name] to delete a picture
	 * - PUT [endpoint]/[name] to edit(rename) a picture
	*/
		endpoint: string = '',
		list: string[];

	function uploadSuccess(file: UppyFile|undefined, response: any) {
		list = [...list, response.body.name];		
	}
	/* TODO? manage errors
	function uploadError(file: UppyFile|undefined, error: any, response: any){
		if (error.isNetworkError) {
		}
	}*/
	onMount(async ()=> {
		// TODO https://uppy.io/docs/locales/
		uppy = new Uppy({
			//locale: await import('@uppy/locales/lib'+locales[$language])
		}).use(Webcam).use(ImageEditor, {}).use(XHR, {endpoint});
		uppy.on('upload-success', uploadSuccess);
		//uppy.on('upload-error', uploadError);
	});
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
		await ajax.delete({}, imageEndPoint);
		moveImg();
	}
	async function save(img: ImgDesc) {
		const slug = slugify(img.name);
		if(slug !== editedPicture!.name) {
			if(list.includes(slug)) throw new NotSaved($I('err.already-name'));
			const rv = await ajax.put({name: slug}, imageEndPoint, [400]);
			if(rv.status === 400) throw new NotSaved($I('err.already-name'));
			moveImg(slug);
		}
	}
	let newName: string,
		imageEndPoint: string,
		slugified: string;
	function srcEndpoint(img?: string) {
		return [endpoint, img].filter(x=> x).join('/');
	}
	$: imageEndPoint = srcEndpoint(editedPicture?.name);
	$: slugified = newName && slugify(newName);
</script>
<Grid stackable doubling>
	<Col eight class="unpopped-uppy">
		{#if uppy}<Dashboard {uppy} {props} {plugins} />{/if}
	</Col>
	<Col eight>
		TODO
		<ul>
			<li>Borrow from other articles</li>
		</ul>
	</Col>
</Grid>
<div class="ui cards">
	{#each list as img (img)}
		<div class="ui card">
			<a href={srcEndpoint(img)} target="_blank" rel="noreferrer" on:click={imgClick} class="image">
				<img src={srcEndpoint(img+'?256')} alt={img}>
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
	<div class="imgr-image-preview">
		{#if editedPicture}
			<img src={imageEndPoint} alt={editedPicture?.name}>
		{/if}
	</div>
</ModalForm>
<style lang="scss" global>
	.imgr-image-preview {
		overflow-y: auto;
		max-height: 70vh;
		img {
			width: 100%;
		}
	}
	.uppy-Informer,
	.unpopped-uppy {
		.uppy-Informer,
		.uppy-Dashboard-AddFilesPanel,
		.uppy-Dashboard-Item.is-ghost .uppy-Dashboard-Item-preview::before,
		.uppy-Dashboard-FileCard,
		.uppy-DashboardContent-panel {
			z-index: 75;
		}
		.uppy-StatusBar-actions,
		.uppy-Dashboard-serviceMsg,
		.uppy-DashboardContent-bar {
			z-index: 74;
		}
		.uppy-ProviderBrowser-viewType--grid .uppy-ProviderBrowserItem-checkbox,
		.uppy-ProviderBrowser-viewType--unsplash .uppy-ProviderBrowserItem-checkbox,
		.uppy-ProviderBrowser-searchFilterIcon,
		.uppy-ProviderBrowser-searchFilterReset,
		.uppy-Dashboard-Item-previewLink,
		.uppy-Dashboard-Item-progress,
		.uppy-size--md .uppy-Dashboard-Item-action--remove, .uppy-Dashboard--singleFile .uppy-Dashboard-Item-action--remove,
		.uppy-StatusBar-content {
			z-index: 72;
		}
		.uppy-ProviderBrowser-header,
		.uppy-ProviderBrowser-headerBar,
		.uppy-ProviderBrowser-searchFilterInput,
		.uppy-StatusBar-progress,
		.uppy-Dashboard-Item-previewInnerWrap::after,
		.uppy-StatusBar {
			z-index: 71;
		}
	}
</style>