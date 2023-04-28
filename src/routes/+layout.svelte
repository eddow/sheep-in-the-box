<script lang="ts">
	import 'svemantic';
	import { accessible } from "$sitb/user";
	import Menu from '../sitb/components/root/Menu.svelte';
	import './styles.scss';
	import { page } from "$app/stores";
	import { dev } from "$app/environment";
	import { pageTitle } from '$sitb/globals';
	let pageFound: boolean;
	$: pageFound = !$page.route.id || accessible($page.route.id);

	const min = dev? '' : '.min';
	const ttlHead = 'SitB';
	let title: string;
	// TODO setTitle in context
	$: title = $pageTitle ? `${ttlHead} - ${$pageTitle}` : ttlHead;
</script>
<svelte:head>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery{min}.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic{min}.js"></script>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.2/semantic{min}.css" />
	<title>{title}</title>
</svelte:head>
<div class="app">
	<nav class="ui top fixed menu">
		<div class="item">
			<a href="/">SitB</a>
		</div>
		<div class="right menu">
			<Menu  />
		</div>
	</nav>
	<div class="main">
		{#if pageFound}
			<slot />
		{:else}
			404 - TODO
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
