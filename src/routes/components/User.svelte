<script lang="ts">
	import { DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown, FormGroup, Input, Label, Button, Popover, ButtonGroup, Icon } from 'sveltestrap';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { getContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { T, dictionary, gotTree, languageStore } from '$lib/intl';
	import { ajax, user, alert } from '$lib/globals';

	const dispatch = createEventDispatcher();

	let state = 'email';
	let registering = false;
	let anonOpened = false;
	let email: string = '';
	let password: string = '';
	let isMenuOpen = false;
	
	function anonOpen() {
		state = 'email';
	}

	async function setEmail({cancel}: {cancel: ()=> void}) {
		cancel();
		if(registering) {
			anonOpened = false;
			let rv = await ajax.put({email}, '/user');
			if(await rv.json()) alert({message: $T('msg.mail-sent', {email})});
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
		let rv = await ajax.post({email, password, roles: dictionary.roles}, '/user', [401]);
		if(rv.ok) {
			const login = await rv.json();
			dispatch('set-user', login.user);
			languageStore.value = login.user.language;
			if(login.dictionary)
				gotTree(login.dictionary);
		} else if(rv.status === 401) {
			const cnt = await(rv.json());
			if(cnt) languageStore.value = cnt;
			alert({message: $T('err.login'), color: 'danger'});
			dispatch('set-user', null);
		}
		email = password = '';
	})(x); }
	async function logout() {
		const rv = await ajax.delete({}, '/user'), cnt = await(rv.json());
		if(cnt) languageStore.value = cnt;
		dispatch('set-user', null);
	}
</script>
{#if $user}
	<ButtonDropdown isOpen={isMenuOpen}>
		<DropdownToggle color="primary" class="btn-rounded prefix-icon" on:click={() => (isMenuOpen = !isMenuOpen)}>
			<Icon name="person-fill" />{$user.email}
		</DropdownToggle>
		<DropdownMenu>
			<DropdownItem href="/user" class="prefix-icon"><Icon name="gear-fill" />{$T('cmd.configure')}</DropdownItem>
			<DropdownItem divider />
			<DropdownItem on:click={logout} class="prefix-icon"><Icon name="box-arrow-left" />{$T('cmd.logout')}</DropdownItem>
		</DropdownMenu>
	</ButtonDropdown>
{:else}
	<Button id="anonIcon" on:click={anonOpen} class="btn-rounded"><Icon name="person-fill" /></Button>
	<Popover target="anonIcon" placement="bottom" title="Identification" bind:isOpen={anonOpened} class="login-popover">
		{#if state === 'email'}
			<form style="display: flex; flex-direction: column; align-items: flex-end;" use:enhance={x=> { setEmail(x); }}>
				<FormGroup floating label="E-mail" style="width: 100%;">
					<Input required bind:value={email} name="identifier" autocomplete="username" placeholder="E-mail" type="text" style="min-width: 200px;" autofocus />
				</FormGroup>
				<ButtonGroup class="prefix-icon">
					<Button name="submit" color="primary">
						<Icon name="box-arrow-in-right" />
						{@html $T('cmd.login')}
					</Button>
					<Button color="secondary" on:click={register}>
						<Icon name="person-fill-add" />
						{@html $T('cmd.register')}
					</Button>
				</ButtonGroup>
			</form>
		{:else if state === 'password'}
			<form style="display: flex; flex-direction: column; align-items: flex-end;" use:enhance={login}>
				<FormGroup floating label="Passphrase" style="width: 100%;">
					<Input required bind:value={password} placeholder="Passphrase" name="password" autocomplete="current-password" type="password" style="min-width: 200px;" autofocus />
				</FormGroup>
				<Button name="submit" color="primary" class="prefix-icon">
					<Icon name="person-check-fill" />
					{@html $T('cmd.login')}
				</Button>
			</form>
		{/if}
	</Popover>
{/if}
<style lang="scss">
</style>