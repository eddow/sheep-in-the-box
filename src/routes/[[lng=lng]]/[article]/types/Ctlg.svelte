<script lang="ts">
	import Fotorama from "$sitb/components/image/Fotorama.svelte";
	import Viewer from "$sitb/components/image/Viewer.svelte";
	import type { ReadArticle } from "$sitb/entities/article";
	import { Grid, Col } from "svemantic";

	export let article: ReadArticle;
	let slugged: string[];
	$: slugged = article.images.map((image)=> `${article.slug}/${image}`);
	let ul: HTMLUListElement;
</script>
<Grid stackable doubling>
	<Col class="ui segment" six>
		<Fotorama images={slugged} width="100%" allowfullscreen nav="thumbs" loop />
	</Col>
	<Col class="ui segment" eight>
		{@html article.text}
	</Col>
	<Col class="ui segment" two>
		TODO - command
	</Col>
</Grid>
<!--Viewer class="catalog gallery" images={slugged} navbar toolbar transition loading slideOnTouch
	rotatable={false} scalable={false} zoomable={false} movable={false} title={false} /-->
<style lang="scss">
	/*:global(.catalog.gallery img) {
		cursor: pointer;
		width: 50%;
		height: auto;
	}*/
</style>