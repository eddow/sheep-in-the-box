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
		DropdownItem
	} from 'sveltestrap';
	import User from './User.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
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
		</Nav>
	</Collapse>
	<Nav>
		<NavItem>
			<User on:set-user={x=> { dispatch('set-user', x.detail); }} />
		</NavItem>
	</Nav>
</Navbar>