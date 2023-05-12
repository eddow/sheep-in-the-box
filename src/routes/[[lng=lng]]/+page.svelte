<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { language } from "$sitb/intl";
	import { onDestroy } from "svelte";
	import { pageTitle } from '$sitb/globals';
	import type { PageData } from "./$types";
	export let data: PageData;

	pageTitle.set(data.title!);
	let first = true;
	onDestroy(language.subscribe(()=> { if(!first) invalidateAll(); }));
	first = false;
</script>
<div class="main ui segment">
	<div class="ui left rail">
		<div class="ui segment">
			Left Rail Content
		</div>
	</div>
	<div class="ui right rail">
		<div class="ui segment">
			Right Rail Content
		</div>
	</div>
	{@html data.text}
</div>
<style lang="scss">
	.main.segment {
		width: 820px;
		margin: 0 auto;
	}
</style>