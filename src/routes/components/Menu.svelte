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
	
	let isOpen = false, logingIn = false;

	function handleUpdate(event: any) {
		isOpen = event.detail.isOpen;
	}
	
	function setLng(e: CustomEvent) {
		setLanguage(<Language>e.detail);
	}
</script>
<Navbar color="light" light expand="md">
	<NavbarBrand href="/">SitB</NavbarBrand>
	<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	<Collapse {isOpen} navbar expand="md" on:update={handleUpdate} class="ms-auto">
		<Nav>
			<NavItem>
				Blah
			</NavItem>
		</Nav>
	</Collapse>
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
	<Nav>
		<NavItem>
			<User on:set-user on:login={()=> logingIn = !logingIn} />
		</NavItem>
		<NavItem>
			<div style="width: .5em;">&nbsp;</div>
		</NavItem>
		<NavItem>
			<Languages language={$language} on:set-language={setLng} />
		</NavItem>
	</Nav>
</Navbar>
<Collapse isOpen={logingIn}>
	<Navbar color="light" light expand="md">
		<Login on:set-user on:done={()=> logingIn = false} />
	</Navbar>
</Collapse>