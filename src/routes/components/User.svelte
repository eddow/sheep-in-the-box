<script lang="ts">
	import { DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown, FormGroup, Input, Label, Button, Popover, ButtonGroup, Icon } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';
	import { T, languageStore } from '$lib/intl';
	import { ajax, user } from '$lib/globals';

	const dispatch = createEventDispatcher();

	async function logout() {
		const rv = await ajax.delete({}, '/user'), cnt = await(rv.json());
		if(cnt) languageStore.value = cnt;
		dispatch('set-user', null);
	}
</script>
{#if $user}
	<ButtonDropdown>
		<DropdownToggle color="primary" class="btn-rounded prefix-icon">
			<Icon name="person-fill" />{$user.email}
		</DropdownToggle>
		<DropdownMenu>
			<DropdownItem href="/user" class="prefix-icon"><Icon name="gear-fill" />{$T('cmd.configure')}</DropdownItem>
			<DropdownItem divider />
			<DropdownItem on:click={logout} class="prefix-icon"><Icon name="box-arrow-left" />{$T('cmd.logout')}</DropdownItem>
		</DropdownMenu>
	</ButtonDropdown>
{:else}
	<Button id="anonIcon" on:click={()=> dispatch('login')} class="btn-rounded"><Icon name="person-fill" /></Button>
{/if}