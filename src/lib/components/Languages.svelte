<script lang="ts">
	import { flags, languages, type Language } from "$sitb/constants";
	import { Languages } from "svemantic";

	export let language: Language;
	const languagesDesc: Record<string, any> = {};
	for(const l in languages) languagesDesc[l] = flags[l] ? {flag: flags[l], text: languages[<Language>l]} : languages[<Language>l];
</script>
<Languages class="icon blue button" languages={languagesDesc} bind:language on:set-language />