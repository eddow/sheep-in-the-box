<script lang="ts">
	import { DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown, FormGroup, Input, Label, Button, Popover, ButtonGroup, Icon } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';
	import { T, dictionary, gotTree, languageStore } from '$lib/intl';
	import { ajax, user, alert } from '$lib/globals';
	import { object, string } from "yup";

	const dispatch = createEventDispatcher();

	let state = 'email', anonOpened = false, gvnMmail: string = '', isMenuOpen = false, cmd: string;
	import Form from "$lib/components/form/Form.svelte";
	import GInput from "$lib/components/form/GInput.svelte";
	
	const emailSchema = object({ email: string().email().required() });
	const passSchema = object({ pass: string().required() });

	function anonOpen() {
		state = 'email';
	}

	async function setEmail(e: CustomEvent) {
		const { values, context } = e.detail, email = values.email;
		context.reset();
		switch(cmd) {
		case 'register':
			anonOpened = false;
			const rv = await ajax.put({email}, '/user');
			if(await rv.json()) alert({message: $T('msg.mail-sent', {email})});
			break;
		case 'go-pp':
			gvnMmail = e.detail.values.email;
			state = 'password';
			break;
		}
	}

	async function login(e: CustomEvent) {
		const { values, context } = e.detail;
		context.reset();
		anonOpened = false;
		let rv = await ajax.post({email: gvnMmail, password: values.pass, roles: dictionary.roles}, '/user', [401]);
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
	}
	async function logout() {
		const rv = await ajax.delete({}, '/user'), cnt = await(rv.json());
		if(cnt) languageStore.value = cnt;
		dispatch('set-user', null);
	}
	// TOTR fld.email, err.email, ??err.required
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
			<Form schema={emailSchema} style="display: flex; flex-direction: column; align-items: flex-end;" on:submit={setEmail}>
				<GInput name="email" autocomplete="email" type="text" style="min-width: 200px;" autofocus fg$style="width: 100%;" />
				<ButtonGroup class="prefix-icon">
					<Button color="primary" on:click={()=> cmd = 'go-pp'}>
						<Icon name="box-arrow-in-right" />
						{@html $T('cmd.login')}
					</Button>
					<Button color="secondary" on:click={()=> cmd = 'register'}>
						<Icon name="person-fill-add" />
						{@html $T('cmd.register')}
					</Button>
				</ButtonGroup>
			</Form>
		{:else if state === 'password'}
			<Form schema={passSchema} style="display: flex; flex-direction: column; align-items: flex-end;" on:submit={login}>
				<GInput name="pass" autocomplete="current-password" type="password" style="min-width: 200px;" autofocus fg$style="width: 100%;" />
				<Button name="submit" color="primary" class="prefix-icon">
					<Icon name="person-check-fill" />
					{@html $T('cmd.login')}
				</Button>
			</Form>
		{/if}
	</Popover>
{/if}