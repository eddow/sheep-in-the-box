<script lang="ts" context="module">
	export function getUser() {
		return getContext('user');
	}
</script>
<script lang="ts">
	import Menu from './Menu.svelte';
	import Alerts from './Alerts.svelte';
	import './styles.scss';
	import { getContext, setContext } from 'svelte';
	import type { LayoutData } from './$types';
	import type { Role } from "$lib/constants"
	import { beforeNavigate, goto } from '$app/navigation';
	import { accessible } from '$lib/auth';
	import { page } from '$app/stores';
	import { privateStore } from '$lib/privateStore';


	type allRoles = Role | 'cust';
	function analyseRoles(str?: string) {
		const rv = {adm: false, trad: false, sell: false, dev: false, cust: false};
		if(typeof str === 'string') {
			rv.cust = true;
			if(str)
				for(const r of str.split(' '))
					if(rv.hasOwnProperty(r))
						rv[<allRoles>r] = true;
		}
		return rv;
	}
	export let data: LayoutData;
	// TODO? User is layout-specific while language is global. Chose one system only ?
	const user = privateStore(data.user), roles = privateStore(analyseRoles(data.user?.roles));
	setContext('user', user.store);
	setContext('roles', roles.store);
	beforeNavigate(async ({to, cancel})=> {
		if(to?.route.id && !accessible(to.route.id, user.value))
			cancel();
	});
	function setUser(nwUser: any) {
		user.value = nwUser;
		roles.value = analyseRoles(nwUser?.roles);
		if($page.route.id && !accessible($page.route.id, nwUser))
			goto('/');
	}
	let alert: any;
	setContext('alert', (alertSpec: AlertSpec)=> { alert(alertSpec); });
</script>
<div class="app">
	<Menu on:set-user={user=> setUser(user.detail)} />
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
