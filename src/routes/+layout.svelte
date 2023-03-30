<script lang="ts" context="module">
	export const pageTitle = writable<string>('');
</script>
<script lang="ts">
	import "svemantic";
	import { accessible, setGlobalUser } from "$sitb/user";
	import Menu from './components/Menu.svelte';
	import './styles.scss';		// TODO The CSS is cached, but something is reaallllyyy slow
	import type { LayoutData } from './$types';
	import { page } from "$app/stores";
	import { beforeNavigate } from "$app/navigation";
	import { dev } from "$app/environment";
	import { writable } from "svelte/store";

	export let data: LayoutData;
	const min = dev? '' : '.min';
	setGlobalUser(data.user, $page.route.id);
	beforeNavigate(async ({to, cancel})=> {
		if(to?.route.id && !accessible(to.route.id))
			cancel();
		else pageTitle.set('');
	});

	const ttlHead = 'SitB';
	let title: string;
	$: title = $pageTitle ? `${ttlHead} - ${$pageTitle}` : ttlHead;
</script>
<svelte:head>
	<script src="/modules/jquery{min}.js"></script>
	<script src="/dist/semantic{min}.js"></script>
	<link rel="stylesheet" href="/dist/semantic{min}.css" />
	<title>{title}</title>
</svelte:head>
<div class="app">
	<Menu on:set-user={e=> setGlobalUser(e.detail, $page.route.id)} />
	<div class="main">
		<slot />
	</div>
</div>
<style lang="scss" global>
	.main h1.top.header .button {
		vertical-align: bottom;
	}

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
		padding: 5rem 0 0 0;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
