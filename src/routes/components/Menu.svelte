<script lang="ts">
	import User from './User.svelte';
	import Languages from '$lib/components/Languages.svelte';
	import { user } from '$lib/globals';
	import { language, setLanguage, T } from "$lib/intl";
	import type { Language, Role } from '$lib/constants';
	import { Buttons, Menu, Dropdown, Icon, LinkItem, toast } from 'svemantic';
	import { browser } from '$app/environment';
		
	function setLng(e: CustomEvent) {
		setLanguage(<Language>e.detail);
	}
	let toolbox: boolean;
	$: toolbox = $user && ['adm', 'dev', 'trad'].some((r: string)=> $user.roles[<Role>r]);
</script>

<section id="nav_menu" class="">
	<nav class="ui top fixed menu">
		<div class="item">
			SitB
		</div>
		<div class="right menu">
			{#if toolbox}
				<div class="item">
					<Dropdown class="icon button" icon="tools">
						<Menu slot="menu" vertical>
							{#if $user?.roles.adm}
								<LinkItem icon={['user', 'corner cog']} href="/users">{$T('ttl.users')}</LinkItem>
							{/if}
							{#if $user?.roles.trad}
								<LinkItem icon="language" href="/translations">{$T('ttl.translations')}</LinkItem>
							{/if}
							{#if $user?.roles.dev}
								<div class="ui horizontal divider header"><Icon icon="code" /></div>
								<LinkItem icon="key" href="/text-keys">{$T('ttl.text-keys')}</LinkItem>
								<a class="nav-link prefix-icon item" data-sveltekit-preload-data="off" data-sveltekit-reload href="/export">
									<Icon icon="cloud download alternate" />{$T('mnu.db-dld')}
								</a>
							{/if}
						</Menu>
					</Dropdown>
				</div>
			{/if}
			<div class="item">
				<Buttons class="user-mgt">
					<User on:set-user />
					<Languages language={$language} on:set-language={setLng} />
				</Buttons>
			</div>
		</div>
	</nav>
</section>
<!--
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
</Navbar> -->
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