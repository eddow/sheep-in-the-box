<script lang="ts">
	import 'svemantic';
	import { accessible, setGlobalUser } from "$sitb/user";
	import Menu from './components/Menu.svelte';
	import './styles.scss';
	import type { LayoutData } from './$types';
	import { page } from "$app/stores";
	import { writable } from "svelte/store";
	import { pageTitle, styles, scripts, scriptLoaded } from '$sitb/globals';
	import Nf404 from '$sitb/components/Nf404.svelte';

	export let data: LayoutData;
	setGlobalUser(data.user);
	let pageFound: boolean;
	$: pageFound = accessible($page.route.id);

	const ttlHead = 'SitB';
	let title: string;
	// TODO setTitle in context
	$: title = $pageTitle ? `${ttlHead} - ${$pageTitle}` : ttlHead;
</script>
<svelte:head>
	{#each scripts as ss (ss)}
		<script src={ss} on:load={()=> scriptLoaded(ss)}></script>
	{/each}
	{#each styles as style (style)}
		<link rel="stylesheet" href={style} />
	{/each}
	<title>{title}</title>
</svelte:head>
<div class="app">
	<Menu on:set-user={e=> setGlobalUser(e.detail)} />
	<div class="main">
		{#if pageFound}
			<slot />
		{:else}
			<Nf404 />
		{/if}
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
