<script lang="ts">
	import { InputHidden } from 'svemantic';
	export let
	/**
	 * @param {string} Url used to edit pictures.
	 * Used to build the following routes:
	 * - GET [endpoint]/[name] to get a picture
	 * - POST [endpoint] to upload a picture
	 * - DELETE [endpoint]/[name] to delete a picture
	 * - PATCH [endpoint]/[name] to edit(rename) a picture
	*/
		endpoint: string = '',
		list: string[],
		selected: string = '';
	function srcEndpoint(img?: string) {
		return [endpoint, img].filter(x=> x).join('/');
	}
</script>
<InputHidden value={selected} />
<!-- TODO: .fields.error -> redish -->
<div class="ui wrapped wrapping menu">
	{#each list as img (img)}
		<a href="#" class="item" class:active={img===selected} on:click={()=> selected = img}>
			<img class="ui image" src={srcEndpoint(img+'?128')} alt={img}>
			<div class="content">{img}</div>
		</a>
	{/each}
</div>
<style lang="scss">
	.item .content {
		padding-left: 16px;
	}
</style>