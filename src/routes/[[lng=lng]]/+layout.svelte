<script lang="ts">
	import { setGlobalAlertCenter } from "$lib/globals";
	import { accessible, setGlobalUser } from "$lib/auth";
	import Menu from './Menu.svelte';
	import Alerts from './Alerts.svelte';
	import './styles.scss';
	import { getContext, setContext } from 'svelte';
	import type { LayoutData } from './$types';
	import type { Role } from "$lib/constants"
	import { page } from "$app/stores";
	import { beforeNavigate } from "$app/navigation";

	type allRoles = Role | 'lgdn';
	function analyseRoles(str?: string) {
		const rv = {adm: false, trad: false, sell: false, dev: false, lgdn: false};
		if(typeof str === 'string') {
			rv.lgdn = true;
			if(str)
				for(const r of str.split(' '))
					if(rv.hasOwnProperty(r))
						rv[<allRoles>r] = true;
		}
		return rv;
	}
	export let data: LayoutData;
	
	setGlobalUser(data.user, $page.route.id);
	beforeNavigate(async ({to, cancel})=> {
		if(to?.route.id && !accessible(to.route.id))
			cancel();
	});

	let alert: (alertSpec: AlertSpec | string)=> void;
$:	setGlobalAlertCenter(alert);
</script>
<div class="app">
	<Menu on:set-user={e=> setGlobalUser(e.detail, $page.route.id)} />
	<main>
		<slot />
	</main>
	<Alerts bind:alert={alert} />
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
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
