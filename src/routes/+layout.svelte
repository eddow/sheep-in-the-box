<script lang="ts">
	import "svemantic";
	import { accessible, setGlobalUser } from "$sitb/user";
	import Menu from './components/Menu.svelte';
	import './styles.scss';		// TODO The CSS is cached, but something is reaallllyyy slow
	import type { LayoutData } from './$types';
	import { page } from "$app/stores";
	import { beforeNavigate } from "$app/navigation";

	export let data: LayoutData;
	
	setGlobalUser(data.user, $page.route.id);
	beforeNavigate(async ({to, cancel})=> {
		if(to?.route.id && !accessible(to.route.id))
			cancel();
	});
</script>
<div class="app">
	<Menu on:set-user={e=> setGlobalUser(e.detail, $page.route.id)} />
	<div class="main">
		<slot />
	</div>
</div>

<style>
	
	.app {/*
		display: flex;
		flex-direction: column;*/
		height: 100vh;
		overflow-y: auto;
	}

	.main {/*
		flex: 1;
		display: flex;
		flex-direction: column;*/
		padding: 5rem 1rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
