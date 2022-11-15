<script lang="ts">
	import { languages, type Language } from "$lib/objects/constants";
	import { language, setLanguage } from "$lib/intl";
	
	import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "sveltestrap";
	const mods: Record<string, string> = {en: 'gb'};
	const flag = (lng: string) => 'fi fi-'+(mods[lng] || lng);
	function setLng(lng: string) { setLanguage(<Language>lng); }
</script>
<Dropdown autoClose={true}>
	<DropdownToggle caret tag="div"><i class={flag($language)}></i></DropdownToggle>
	<DropdownMenu>
		{#each Object.keys(languages) as lng}
			<DropdownItem class="prefix-icon" on:click={()=> setLng(lng)}><i class={flag(lng)}></i>{languages[lng]}</DropdownItem>
		{/each}
	</DropdownMenu>
</Dropdown>