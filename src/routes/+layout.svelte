<script lang="ts">
	import Menu from './Menu.svelte';
	import Alerts from './Alerts.svelte';
	import './styles.scss';
	import { setContext } from 'svelte';
	import type { LayoutData } from './$types';
	import { readable } from 'svelte/store';

	export let data: LayoutData;
	let updateUser: (user: any)=> void;
	console.log(data.user);
	setContext('user', readable(data.user, (set)=> { updateUser = set; }));
	let alert: any;
	setContext('alert', (alertSpec: AlertSpec)=> { alert(alertSpec); });
</script>
<div class="app">
	<Menu on:set-user={user=> updateUser(user.detail)} />
	<main>
		<slot />
	</main>

	<footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
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

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
