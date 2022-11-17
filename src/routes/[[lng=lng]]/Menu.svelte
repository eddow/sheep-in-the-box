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
	import Languages from './Languages.svelte';
	import { user } from '$lib/globals';
	
	let isOpen = false;

	function handleUpdate(event: any) {
		isOpen = event.detail.isOpen;
	}
</script>
<Navbar color="light" light expand="md">
	<NavbarBrand href="/">sveltestrap</NavbarBrand>
	<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	<Collapse {isOpen} navbar expand="md" on:update={handleUpdate} class="ms-auto">
		<Nav>
			<NavItem>
				<NavLink href="#components/">Components</NavLink>
			</NavItem>
			<!--{#if $user?.roles.dev}-->
				<NavItem><NavLink href="/text-keys"><Icon name="key" />Text keys</NavLink></NavItem>
				<NavItem><a data-sveltekit-reload href="/export"><Icon name="download" />Download DB</a></NavItem>
		</Nav>
	</Collapse>
	<Nav>
		<NavItem>
			<User on:set-user />
		</NavItem>
		<NavItem>
			<div style="width: .5em;">&nbsp;</div>
		</NavItem>
		<NavItem>
			<Languages on:set-language />
		</NavItem>
	</Nav>
</Navbar>