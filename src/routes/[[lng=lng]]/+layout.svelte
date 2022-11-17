<script lang="ts">
	import { accessible, setGlobalUser } from "$lib/auth";
	import Menu from './Menu.svelte';
	import Alerts from './Alerts.svelte';
	import './styles.scss';
	import { getContext, setContext } from 'svelte';
	import type { LayoutData } from './$types';
	import type { Role } from "$lib/constants"
	import { page } from "$app/stores";
	import { beforeNavigate } from "$app/navigation";
	import Confirm from "./Confirm.svelte";

	export let data: LayoutData;
	
	setGlobalUser(data.user, $page.route.id);
	beforeNavigate(async ({to, cancel})=> {
		if(to?.route.id && !accessible(to.route.id))
			cancel();
	});
</script>
<div class="app">
	<Menu on:set-user={e=> setGlobalUser(e.detail, $page.route.id)} />
	<main>
		<slot />
	</main>
	<Alerts />
	<Confirm />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
