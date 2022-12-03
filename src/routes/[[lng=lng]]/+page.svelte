<script lang="ts">
	import { preferences } from '$lib/user';
	import { Input } from 'sveltestrap';
	
	let prefs: any;
$:	prefs = $preferences;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<Input type="search" bind:value={prefs.testPref} />
