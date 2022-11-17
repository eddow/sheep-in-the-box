<script>
	import { dictionary, T } from '$lib/intl';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Sheep in the box" />
</svelte:head>
{$T('test.adm')}
<br />
{JSON.stringify(dictionary)}

<style>
</style>
