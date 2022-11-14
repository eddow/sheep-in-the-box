<script lang="ts">
	import { DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown, FormGroup, Input, Label, Button, Popover, ButtonGroup, Icon } from 'sveltestrap';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { getContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const alert: (spec: AlertSpec)=> void = getContext('alert');
	let state = 'email';
	let registering = false;
	let anonOpened = false;
	let email: string = '';
	let password: string = '';
	let isMenuOpen = false;
	const user = getContext<SveltStore>('user');
	
	function anonOpen() {
		state = 'email';
	}

	function setEmail({cancel}: {cancel: ()=> void}) {
		cancel();
		if(registering) {
			// TODO fetch
			anonOpened = false;
			alert({message: `An email has been sent to ${email}`});
			email = password = '';
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
		if(Math.floor(rv.status/100) === 4) {
			alert({message: 'Wrong login', color: 'danger'});
			dispatch('set-user', null);
		} else dispatch('set-user', await rv.json());
		email = password = '';
	})(x); }
	async function logout() {
		let rv = await fetch('/user', {
			method: 'DELETE'
		});
		dispatch('set-user', null);
	}
</script>
{#if $user}
	<ButtonDropdown isOpen={isMenuOpen}>
		<DropdownToggle color="primary" on:click={() => (isMenuOpen = !isMenuOpen)}>
			<Icon name="person-fill" />{$user.email}
		</DropdownToggle>
		<DropdownMenu>
			<DropdownItem><Icon name="gear-fill" />Configure</DropdownItem>
			<DropdownItem divider />
			<DropdownItem on:click={logout}><Icon name="box-arrow-left" />Log out</DropdownItem>
		</DropdownMenu>
	</ButtonDropdown>
{:else}
	<Button id="anonIcon" on:click={anonOpen} class="btn-rounded"><Icon name="person-fill" /></Button>
	<Popover target="anonIcon" placement="bottom" title="Identification" bind:isOpen={anonOpened}>
		{#if state === 'email'}
			<form style="margin: 1em; display: flex; flex-direction: column; align-items: flex-end;" use:enhance={setEmail}>
				<FormGroup floating label="E-mail">
					<Input required bind:value={email} placeholder="E-mail" type="text" style="min-width: 200px;" autofocus autocomplete="on" />
				</FormGroup>
				<ButtonGroup>
					<Button name="submit" color="primary">
						<Icon name="box-arrow-in-right" />
						Log&#8209;in
					</Button>
					<Button color="secondary" on:click={register}>
						<Icon name="person-fill-add" />
						Register<br />Lost&nbsp;password
					</Button>
				</ButtonGroup>
			</form>
		{:else if state === 'password'}
			<form style="margin: 1em; display: flex; flex-direction: column; align-items: flex-end;" use:enhance={login}>
				<FormGroup floating label="Password">
					<Input required bind:value={password} placeholder="Password" type="password" style="min-width: 200px;" autofocus autocomplete="on" />
				</FormGroup>
				<Button name="submit" color="primary">
						<Icon name="person-check-fill" />
					Log&#8209;in
				</Button>
			</form>
		{/if}
	</Popover>
{/if}