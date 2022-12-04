<script lang="ts">
	import { flag, languages, type Language } from "$lib/constants";
	import { createEventDispatcher } from "svelte";
	
	const dispatch = createEventDispatcher();
	import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "sveltestrap";
	export let language: Language;
	function setLng(lng: string) {
		dispatch('set-language', lng)
		language = <Language>lng;
	}
</script>
<Dropdown autoClose={true} {...$$restProps}>
	<DropdownToggle caret tag="div"><i class={flag(language)}></i></DropdownToggle>
	<DropdownMenu>
		{#each Object.keys(languages) as lng}
			<DropdownItem class="prefix-icon" on:click={()=> setLng(lng)}><i class={flag(lng)}></i>{languages[lng]}</DropdownItem>
		{/each}
	</DropdownMenu>
</Dropdown>