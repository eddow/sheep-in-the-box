<script lang="ts">
	import Viewer from "$sitb/components/image/Viewer.svelte";
import type { ReadArticle } from "$sitb/entities/article";

	export let article: ReadArticle;
	let slugged: string[];
	$: slugged = article.images.map((image)=> `${article.slug}/${image}`);
	let ul: HTMLUListElement;
</script>
<div class="main ui segment">
	<div class="ui left rail">
		<div class="ui segment">
			<Viewer class="catalog gallery" images={slugged} navbar toolbar transition loading slideOnTouch
				rotatable={false} scalable={false} zoomable={false} movable={false} title={false} />
		</div>
	</div>
	<div class="ui right rail">
		<div class="ui segment">
			TODO: Command here
		</div>
	</div>
	{@html article.text}
</div>
<style lang="scss">
	.main.segment {
		width: 820px;
		margin: 0 auto;
	}
	:global(.catalog.gallery img) {
		cursor: pointer;
		width: 50%;
		height: auto;
	}
</style>