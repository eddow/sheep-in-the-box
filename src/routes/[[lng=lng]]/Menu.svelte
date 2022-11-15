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
	import { getContext } from 'svelte';
	
	let isOpen = false;

	const roles = getContext<SvelteStore<any>>('roles');
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
			{#if $roles.dev}
				<NavItem>
					<NavLink href="/text-keys"><Icon name="key" />Text keys</NavLink>
				</NavItem>
			{/if}
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