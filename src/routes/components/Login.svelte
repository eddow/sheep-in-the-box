<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { T, dictionary, gotTree, languageStore } from '$lib/intl';
	import { ajax, alert } from '$lib/globals';
	import { object, string } from "yup";

	const dispatch = createEventDispatcher();

	let state = 'login';
	import { Form, Field, Tabs, Page, Button, Header } from "svemantic";
	
	const regSchema = object({ email: string().email().required() });
	const loginSchema = object({
		email: string().email().required(),
		pass: string().required()
	});

	async function register({detail: {values: {email}, context: {reset}}}: CustomEvent) {
		const rv = await ajax.put({email}, '/user');
		if(await rv.json()) {
			reset();
			alert({message: $T('msg.mail-sent', {email})});
			dispatch('done');
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
			dispatch('done');
		} else if(rv.status === 401) {
			const cnt = await(rv.json());
			if(cnt) languageStore.value = cnt;
			alert({message: $T('err.login'), color: 'danger'});
			dispatch('set-user', null);
		}
	}
	// TODO Use a real library + get rid of the session cookie for a real authentication one
</script>
<Tabs active="login" let:spec headerClass="two-items">
	<Page key="login" {spec}>
		<Header slot="header">{$T('cmd.login')}</Header>
		<Form on:submit={login}>
			<Field required validate="email" icon="at" name="email" leftIcon />
			<Field required type="password" icon="key" name="password" leftIcon />
			<Button primary fluid submit icon="sign in alternate">{$T('cmd.login')}</Button>
		</Form>
	</Page>
	<Page {spec}>
		<Header slot="header">{$T('cmd.register')}</Header>
		<Form on:submit={register}>
			<Field required validate="email" icon="at" name="email" leftIcon />
			<Button primary fluid submit icon={['user', 'corner green add']}>{$T('cmd.register')}</Button>
		</Form>
	</Page>
</Tabs>
<style lang="scss" global>
.ui.menu.two-items {

	> .item {
    	width: 50%;
	}
}
</style>