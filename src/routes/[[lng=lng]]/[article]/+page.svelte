<script lang="ts">
	import { pageTitle } from '$sitb/globals';
	import type { PageData } from "./$types";
	export let data: PageData;

	pageTitle.set(data.title);
</script>
{@html data.article}