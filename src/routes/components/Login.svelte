<script lang="ts">
	import { Button, Icon, Container, Row, InputGroup, InputGroupText } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';
	import { T, dictionary, gotTree, languageStore } from '$lib/intl';
	import { ajax, user, alert } from '$lib/globals';
	import { object, string } from "yup";

	const dispatch = createEventDispatcher();

	let state = 'login';
	import Form from "$lib/components/form/Form.svelte";
	import Input from "$lib/components/form/Input.svelte";
	import LoginItem from './LoginItem.svelte';
	
	const regSchema = object({ email: string().email().required() });
	const loginSchema = object({
		email: string().email().required(),
		pass: string().required()
	});

	async function reg(e: CustomEvent) {
		const { values, context } = e.detail, email = values.email;
		const rv = await ajax.put({email}, '/user');
		if(await rv.json()) {
			context.reset();
			alert({message: $T('msg.mail-sent', {email})});
			dispatch('done');
		}
	}

	async function login(e: CustomEvent) {
		const { values, context } = e.detail;
		let rv = await ajax.post({email: values.email, password: values.pass, roles: dictionary.roles}, '/user', [401]);
		if(rv.ok) {
			context.reset();
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
<Container>
	<Row>
		{#if state === 'login'}
			<Form schema={loginSchema} on:submit={login} class="row">
				<LoginItem field>
					<InputGroup>
						<InputGroupText>@</InputGroupText>
						<Input name="email" autocomplete="email" type="text" autofocus />
					</InputGroup>
				</LoginItem>
				<LoginItem field>
					<InputGroup>
						<InputGroupText><Icon name="shield-lock" /></InputGroupText>
						<Input name="pass" autocomplete="current-password" type="password" />
					</InputGroup>
				</LoginItem>
				<LoginItem>
					<Button type="submit" color="primary" class="prefix-icon" style="width: 100%;">
						<Icon name="box-arrow-in-right" />
						{@html $T('cmd.login')}
					</Button>
				</LoginItem>
				<LoginItem>
					<Button type="button" color="secondary" class="prefix-icon" style="width: 100%;" on:click={()=> state='reg'}>
						<Icon name="person-fill-add" />
						{@html $T('cmd.register')}
					</Button>
				</LoginItem>
			</Form>
		{:else if state === 'reg'}
			<Form schema={regSchema} on:submit={reg} class="row">
				<LoginItem field>
					<InputGroup>
						<InputGroupText>@</InputGroupText>
						<Input name="email" autocomplete="email" type="text" autofocus />
					</InputGroup>
				</LoginItem>
				<LoginItem>
					<Button type="submit" color="primary" class="prefix-icon" style="width: 100%;">
						<Icon name="person-check-fill" />
						{@html $T('cmd.register')}
					</Button>
				</LoginItem>
				<LoginItem>
					<Button type="button" color="secondary" class="prefix-icon" style="width: 100%;" on:click={()=> state='login'}>
						<Icon name="box-arrow-in-right" />
						{@html $T('cmd.login')}
					</Button>
				</LoginItem>
			</Form>
		{/if}
	</Row>
</Container>