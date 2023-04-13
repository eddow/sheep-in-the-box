<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { I, dictionary, gotTree, languageStore } from '$sitb/intl';
	import { ajax, user } from '$sitb/globals';
	import { Input, Form, Field, Tabs, Page, Button, Header, Popup, Dropdown, LinkItem, Menu, toast, type PopupSettings } from "svemantic";

	const dispatch = createEventDispatcher();
	let doneLogingIn: ()=> void;

	async function register({detail: {values: {email}, context: {reset}}}: CustomEvent) {
		const rv = await ajax.put({email}, '/user');
		if(await rv.json()) {
			reset();
			toast({message: $I('msg.mail-sent', {email})});
			doneLogingIn();
		}
	}

	async function login({detail: {values, context: {reset}}}: CustomEvent) {
		let rv = await ajax.post({...values, roles: dictionary.roles}, '/user', [401]);
		if(rv.ok) {
			reset();
			const login = await rv.json();
			dispatch('set-user', login.user);
			languageStore.value = login.user.language;
			if(login.dictionary)
				gotTree(login.dictionary);
			doneLogingIn();
		} else if(rv.status === 401) {
			const cnt = await(rv.json());
			if(cnt) languageStore.value = cnt;
			toast({message: $I('err.login'), class: 'error'});
			dispatch('set-user', null);
		}
	}
	async function logout() {
		const rv = await ajax.delete({}, '/user'), cnt = await(rv.json());
		if(cnt) languageStore.value = cnt;
		dispatch('set-user', null);
	}
	let ppp: PopupSettings;
</script>
{#if $user}
	<Dropdown class="icon button" icon="colored blue user">
		<Menu vertical>
			<div class="right-aligned header">{$user.email}</div>
			<LinkItem icon="cog" href="/user">{$I('cmd.configure')}</LinkItem>
			<div class="ui divider"></div>
			<LinkItem icon="sign out alternate" on:click={logout}>{$I('cmd.logout')}</LinkItem>
		</Menu>
	</Dropdown>
{:else}
	<Popup bind:config={ppp} on="click" bind:hide={doneLogingIn} lastResort="bottom right">
		<Tabs active="login" headerClass="two-items">
			<Page key="login">
				<Header slot="header">{$I('cmd.login')}</Header>
				<Form on:submit={login}>
					<Field required label name="email" validate="email">
						<Input type="email" left-icon="at" name="email" />
					</Field>
					<Field required label name="pass">
						<Input type="password" left-icon="key" />
					</Field>
					<Button primary fluid submit icon="sign in alternate">{$I('cmd.login')}</Button>
				</Form>
			</Page>
			<Page>
				<Header slot="header">{$I('cmd.register')}</Header>
				<Form on:submit={register}>
					<Field label name="email" required validate="email">
						<Input type="email" left-icon="at" name="email" />
					</Field>
					<Button primary fluid submit icon={['user', 'corner green add']}>{$I('cmd.register')}</Button>
				</Form>
			</Page>
		</Tabs>
	</Popup>
	<Button icon="user" popup={ppp} />
{/if}
<style lang="scss" global>
.right-aligned {
	text-align: right;
}
.ui.menu.two-items {

	> .item {
    	width: 50%;
	}
}
</style>