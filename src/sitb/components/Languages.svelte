<script lang="ts">
	import { flags, languages, type Language } from "$sitb/constants";
	import { Languages } from "svemantic";

	export let language: Language;
	const languagesDesc: Record<string, any> = {};
	for(const [l, d] of Object.entries(languages))
		languagesDesc[l] = flags[d.code] ? {flag: flags[d.code], text: d.text} : d.text;
</script>
<Languages class="icon blue button" languages={languagesDesc} bind:language on:set-language />