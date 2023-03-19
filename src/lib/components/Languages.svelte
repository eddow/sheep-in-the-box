<script lang="ts">
	import { flags, languages, type Language } from "$lib/constants";
	import { Languages } from "svemantic";

	export let language: Language;
	const languagesDesc: Record<string, any> = {};
	for(const l in languages) languagesDesc[l] = flags[l] ? {flag: flags[l], text: languages[l]} : languages[l];
</script>
<Languages class="icon blue button" languages={languagesDesc} bind:language on:set-language />