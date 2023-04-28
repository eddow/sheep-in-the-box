<script lang="ts">
	import { browser, dev } from "$app/environment";

	const min = dev? '' : '.min';	
	export let
		module: string = '',
		lib: string = '',
		script: string = '.js',
		style: string = '.css';
	let mndScript: string, mndStyle: string, loaded: ()=> void;
	const loading = (!module || (browser && jQuery()[<any>module])) ?
		Promise.resolve() :
		new Promise<void>(resolve => loaded = resolve);
	function file(spec: string) {
		return (lib+spec).replace('$', min)
	}
	$: mndScript = file(script);
	$: mndStyle = file(style);
</script>
<svelte:head>
	{#if mndScript}<script src={mndScript} on:load={loaded}></script>{/if}
	{#if mndStyle}<link rel="stylesheet" href={mndStyle} />{/if}		
</svelte:head>
<slot {loading} />