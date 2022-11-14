<script lang="ts">
	import { Form, FormGroup, Input, Label, Button, Popover, ButtonGroup } from 'sveltestrap';
	import { enhance, type SubmitFunction } from '$app/forms';

	let state = 'email';
	let registering = false;
	let anonOpened = false;
	let email: string = '';
	let password: string = '';

	function anonOpen() {
		state = 'email';
	}

	function setEmail({cancel}: {cancel: ()=> void}) {
		cancel();
		if(registering) {
			// TODO fetch
			state = 'sent';
			// TODO toast
			email = password = '';
			state = 'sent';
		} else {
			state = 'password';
		}
	}
	function register() {
		registering = true;
		setTimeout(()=> { registering = false; })
	}

	const login: SubmitFunction<Record<string, any>, Record<string, any>> = x=> { (async ({cancel}: {cancel: ()=> void}) => {
		cancel();
		anonOpened = false;
		let rv = await fetch('/user', {
			method: 'POST',
			body: JSON.stringify({email, password})
		});
		debugger;
		email = password = '';
	})(x); }
</script>
<Button id="anonIcon" on:click={anonOpen}>Anon</Button>
<Popover dismissible target="anonIcon" placement="bottom" title="Identification" bind:isOpen={anonOpened}>
	{#if state === 'email'}
		<form style="margin: 1em; display: flex; flex-direction: column; align-items: flex-end;" use:enhance={setEmail}>
			<FormGroup floating label="E-mail">
				<Input required bind:value={email} type="email" style="min-width: 200px;" autofocus autocomplete="on" />
			</FormGroup>
			<ButtonGroup>
				<Button color="secondary" on:click={register}>
					<!--Icon class="material-icons">add</Icon-->
					Register / Lost password
				</Button>
				<Button name="submit" color="primary">
					<!--Icon class="material-icons">login</Icon-->
					Log&nbsp;in
				</Button>
			</ButtonGroup>
		</form>
	{:else if state === 'password'}
		<form style="margin: 1em; display: flex; flex-direction: column; align-items: flex-end;" use:enhance={login}>
			<FormGroup floating label="Password">
				<Input required bind:value={password} type="password" style="min-width: 200px;" autofocus autocomplete="on" />
			</FormGroup>
			<Button name="submit" color="primary">
				<!--Icon class="material-icons">login</Icon-->
				Log&#8209;in
			</Button>
		</form>
	{/if}
</Popover>