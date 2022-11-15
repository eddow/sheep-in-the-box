<script lang="ts">
	import { DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown, FormGroup, Input, Label, Button, Popover, ButtonGroup, Icon } from 'sveltestrap';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { getContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { T, dictionary, gotTree, language } from '$lib/intl';
	import type { PageData } from './$types';

	const dispatch = createEventDispatcher();

	const alert: (spec: AlertSpec)=> void = getContext('alert');
	let state = 'email';
	let registering = false;
	let anonOpened = false;
	let email: string = '';
	let password: string = '';
	let isMenuOpen = false;
	let data: PageData
	const user = getContext<SvelteStore<any>>('user');
	
	function anonOpen() {
		state = 'email';
	}

	async function setEmail({cancel}: {cancel: ()=> void}) {
		cancel();
		if(registering) {
			anonOpened = false;
			let rv = await fetch('/user', {
				method: 'PUT',
				body: JSON.stringify({email})
			});
			if(await rv.json()) alert({message: `An email has been sent to ${email}`});
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
			body: JSON.stringify({email, password, roles: dictionary.roles})
		});
		if(Math.floor(rv.status/100) === 4) {
			const cnt = await(rv.json());
			if(cnt) language.set(cnt);
			alert({message: 'Wrong login', color: 'danger'});
			dispatch('set-user', null);
		} else {
			const login = await rv.json();
			dispatch('set-user', login.user);
			language.set(login.user.language);
			if(login.dictionary)
				gotTree(login.dictionary);
		}
		email = password = '';
	})(x); }
	async function logout() {
		const rv = await fetch('/user', {
			method: 'DELETE'
		}), cnt = await(rv.json());
		if(cnt) language.set(cnt);
		dispatch('set-user', null);
	}
</script>
{#if $user}
	<ButtonDropdown isOpen={isMenuOpen}>
		<DropdownToggle color="primary" class="btn-rounded prefix-icon" on:click={() => (isMenuOpen = !isMenuOpen)}>
			<Icon name="person-fill" />{$user.email}
		</DropdownToggle>
		<DropdownMenu>
			<DropdownItem href="/user" class="prefix-icon"><Icon name="gear-fill" />Configure</DropdownItem>
			<DropdownItem divider />
			<DropdownItem on:click={logout} class="prefix-icon"><Icon name="box-arrow-left" />Log out</DropdownItem>
		</DropdownMenu>
	</ButtonDropdown>
{:else}
	<Button id="anonIcon" on:click={anonOpen} class="btn-rounded"><Icon name="person-fill" /></Button>
	<Popover target="anonIcon" placement="bottom" title="Identification" bind:isOpen={anonOpened}>
		{#if state === 'email'}
			<form style="margin: 1em; display: flex; flex-direction: column; align-items: flex-end;" use:enhance={x=> { setEmail(x); }}>
				<FormGroup floating label="E-mail">
					<Input required bind:value={email} name="identifier" autocomplete="username" placeholder="E-mail" type="text" style="min-width: 200px;" autofocus />
				</FormGroup>
				<ButtonGroup class="prefix-icon">
					<Button name="submit" color="primary">
						<Icon name="box-arrow-in-right" />
						Log&#8209;in
					</Button>
					<Button color="secondary" on:click={register}>
						<Icon name="person-fill-add" />
						{@html $T('cmd.register')}
					</Button>
				</ButtonGroup>
			</form>
		{:else if state === 'password'}
			<form style="margin: 1em; display: flex; flex-direction: column; align-items: flex-end;" use:enhance={login}>
				<FormGroup floating label="Passphrase">
					<Input required bind:value={password} placeholder="Passphrase" name="password" autocomplete="current-password" type="password" style="min-width: 200px;" autofocus />
				</FormGroup>
				<Button name="submit" color="primary" class="prefix-icon">
					<Icon name="person-check-fill" />
					Log&#8209;in
				</Button>
			</form>
		{/if}
	</Popover>
{/if}