<script lang="ts">
	import { accessible, setGlobalUser } from "$lib/auth";
	import Menu from './components/Menu.svelte';
	import Alerts from './components/Alerts.svelte';
	import Confirm from "./components/Confirm.svelte";
	import './styles.scss';
	import type { LayoutData } from './$types';
	import { page } from "$app/stores";
	import { beforeNavigate } from "$app/navigation";

	export let data: LayoutData;
	
	setGlobalUser(data.user, $page.route.id);
	beforeNavigate(async ({to, cancel})=> {
		if(to?.route.id && !accessible(to.route.id))
			cancel();
	});
	// TODO Cache CSS!!
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
