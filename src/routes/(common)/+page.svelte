<script>
	import { dictionary, T } from '$lib/intl';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Sheep in the box" />
</svelte:head>
{$T('test.adm')}
<!--button on:click={()=> alert($T('test.adm'))}>{$T('test.adm')}</button--> <br />
{JSON.stringify(dictionary)}

<style>
</style>
