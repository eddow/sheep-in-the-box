<script lang="ts" context="module">
	let count = 0;
	function getUniqueId() { return 'upl'+(++count); }
</script>
<script lang="ts">
	import { Grid, Col, Button } from 'svemantic';
import { FileUploadWithPreview } from 'file-upload-with-preview';
	import 'file-upload-with-preview/dist/style.css';
	import { onMount } from 'svelte';
	import { ajax } from '$sitb/ajax';
	const uid = getUniqueId();
	let uploader: FileUploadWithPreview;
	export let article: string;
	onMount(()=> {
		uploader = new FileUploadWithPreview(uid, {
			multiple: true
		});
		// TODO: text { chooseFile: 'Choose file...', browse: 'Browse', label: 'Upload', selectedCount: 'files selected' }
		
	});
	function upload() {
		for(const image of uploader.cachedFileArray) {
			const body = {type: image.type, name: image.name.split('.')[0]};
			const reader = new FileReader();
			reader.readAsDataURL(image);
			reader.onload = e => {
				const b64 = <string>e.target!.result, cNdx = b64.indexOf(',');
				ajax.post({
					...body,
					content: b64.substring(cNdx+1)
				}, '/raw/'+article);
				//avatar = e.target.result;
			};
		}
	}
</script>
<Grid stackable doubling class="bottom aligned">
	<Col eight>
		<div class="custom-file-container" data-upload-id={uid}></div>
		<Button fluid primary on:click={upload}>Add</Button>
	</Col>
</Grid>