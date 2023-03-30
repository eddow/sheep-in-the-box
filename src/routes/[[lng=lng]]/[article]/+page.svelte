<script lang="ts">
	import { pageTitle } from "../../+layout.svelte";
	import type { PageData } from "./$types";
	export let data: PageData;

	pageTitle.set(data.title);
</script>
buuuu
{data.article}