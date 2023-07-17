<script lang="ts">
	import { createEventDispatcher, afterUpdate } from "svelte";
	import { PUBLIC_GOOGLE_CLIENT_ID }  from "$env/static/public";

	const dispatch = createEventDispatcher();
	let gglBtn: HTMLElement;
	if(typeof google !== 'undefined') {
		afterUpdate(() => {
			const handleCredentialResponse = (response: any) => {
				dispatch('set-user', {values: {gglToken: response.credential}});
			};
			google.accounts.id.initialize({
				client_id: PUBLIC_GOOGLE_CLIENT_ID,
				callback: handleCredentialResponse
			});
			google.accounts.id.prompt();
			google.accounts.id.renderButton(gglBtn, {
				type: 'icon',
				size: 'medium',
				theme: 'outline',
				text: 'continue_with',
				shape: 'circle',
				logo_alignment: 'left'
			});
		});
	}
</script>
<svelte:head>
	{#if PUBLIC_GOOGLE_CLIENT_ID}
		<script src="https://accounts.google.com/gsi/client" async></script>
		<meta name="referrer" content="strict-origin-when-cross-origin" />
	{/if}
</svelte:head>
{#if PUBLIC_GOOGLE_CLIENT_ID}
	<span style="display: inline-block;" bind:this={gglBtn}></span>
{/if}