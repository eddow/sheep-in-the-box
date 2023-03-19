<script lang="ts">
	import {
		Collapse,
		Navbar,
		NavbarToggler,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink,
		Dropdown,
		DropdownToggle,
		DropdownMenu,
		DropdownItem,
		Icon
	} from 'sveltestrap';
	import User from './User.svelte';
	import Languages from '$lib/components/Languages.svelte';
	import { user } from '$lib/globals';
	import { language, setLanguage, T } from "$lib/intl";
	import type { Language } from '$lib/constants';
	import Login from './Login.svelte';
	import { Button, Buttons, Popup } from 'svemantic';
	
	let doneLogingIn: ()=> void;
	
	function setLng(e: CustomEvent) {
		setLanguage(<Language>e.detail);
	}
</script>

<section id="nav_menu" class="">
	<nav class="ui top attached menu">
		<div class="item">
			SitB
		</div>
		<div class="right menu">
			<div class="browse item">
				{$T('cmd.login')}
			</div>
			<div class="item">
				<Buttons class="user-mgt">
					<Button icon="user" />
					<Popup on="click" bind:hide={doneLogingIn}>
						<Login on:set-user on:done={doneLogingIn} />
					</Popup>
					<Languages language={$language} on:set-language={setLng} />
				</Buttons>
			</div>
		</div>
	</nav>
</section>
<Navbar color="light" light expand="md">
	{#if $user?.roles.adm}
		<Dropdown>
			<DropdownToggle caret><Icon name="person-lines-fill" /></DropdownToggle>
			<DropdownMenu>
				<DropdownItem><NavLink class="prefix-icon" href="/users"><Icon name="person-badge" />{$T('ttl.users')}</NavLink></DropdownItem>
			</DropdownMenu>
		</Dropdown>
	{/if}
	{#if $user?.roles.trad}
		<Dropdown>
			<DropdownToggle caret><Icon name="translate" /></DropdownToggle>
			<DropdownMenu>
				<DropdownItem><NavLink class="prefix-icon" href="/translations"><Icon name="gear-fill" />{$T('ttl.translations')}</NavLink></DropdownItem>
			</DropdownMenu>
		</Dropdown>
	{/if}
	{#if $user?.roles.dev}
		<Dropdown>
			<DropdownToggle caret><Icon name="tools" /></DropdownToggle>
			<DropdownMenu>
				<DropdownItem><NavLink class="prefix-icon" href="/text-keys"><Icon name="key" />{$T('ttl.text-keys')}</NavLink></DropdownItem>
				<DropdownItem>
					<a class="nav-link prefix-icon" data-sveltekit-preload-data="off" data-sveltekit-reload href="/export">
						<Icon name="download" />{$T('mnu.db-dld')}
					</a>
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	{/if}
</Navbar>
<style lang="scss" global>
	//TODO: make this work
.ui.buttons.user-mgt {
	> .button:first-child {
		border-top-left-radius: 1rem;
		border-bottom-left-radius: 1rem;
	}
	> .button:last-child {
		border-top-right-radius: 1rem;
		border-bottom-right-radius: 1rem;
	}
}
</style>