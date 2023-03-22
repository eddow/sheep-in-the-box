<script lang="ts">
	import User from './User.svelte';
	import Languages from '$sitb/components/Languages.svelte';
	import { user } from '$sitb/globals';
	import { language, setLanguage, T } from "$sitb/intl";
	import type { Language, Role } from '$sitb/constants';
	import { Buttons, Menu, Dropdown, Icon, LinkItem, toast } from 'svemantic';
	import { browser } from '$app/environment';
		
	function setLng(e: CustomEvent) {
		setLanguage(<Language>e.detail);
	}
	let toolbox: boolean;
	$: toolbox = $user && ['adm', 'dev', 'trad'].some((r: string)=> $user.roles[<Role>r]);
</script>

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
<style lang="scss" global>
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