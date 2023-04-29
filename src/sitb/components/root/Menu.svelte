<script lang="ts">
	import User from './User.svelte';
	import Languages from '$sitb/components/Languages.svelte';
	import { user } from '$sitb/globals';
	import { language, setLanguage, I } from "$sitb/intl";
	import type { Language, Role, Roles } from '$sitb/constants';
	import { Buttons, Menu, Dropdown, LinkItem } from 'svemantic';
	import type { ComponentType } from 'svelte';
	import { importNodules, nodulesData } from '$sitb/nodules';
	
	// TODO: pre-load nodules
	let nodules: {component: ComponentType, data: any}[] = [];
	async function loadNodules(roles: Roles, nodulesData: any) {
		nodules = Object.entries(await importNodules('menu', roles))
			.map(([k, n])=> ({
				component: n.default,
				data: nodulesData[k]
			}));
	}
	$: loadNodules($user?.roles || {lgdn: false}, $nodulesData);

	function setLng(e: CustomEvent) {
		setLanguage(<Language>e.detail);
	}
	let toolbox: boolean;
	$: toolbox = $user && ['adm', 'dev', 'trad', 'cms'].some((r: string)=> $user.roles[<Role>r]);
</script>
{#if toolbox}
	<div class="item">
		<Buttons>
			{#each nodules as nodule}
				<svelte:component this={nodule.component} data={nodule.data} />
			{/each}
			<Dropdown class="icon button" icon="tools">
				<Menu vertical>
					{#if $user?.roles.adm}
						<LinkItem icon={['user', 'corner cog']} href="/users">{$I('ttl.users')}</LinkItem>
					{/if}
					{#if $user?.roles.trad}
						<LinkItem icon="language" href="/translations">{$I('ttl.translations')}</LinkItem>
					{/if}
					{#if $user?.roles.cms}
						<LinkItem icon="edit" href="/edit">{$I('ttl.content.edit')}</LinkItem>
					{/if}
					{#if $user?.roles.dev}
						<LinkItem icon="key" href="/text-keys">{$I('ttl.text-keys')}</LinkItem>
					{/if}
				</Menu>
			</Dropdown>
		</Buttons>
	</div>
{/if}
<div class="item">
	<Buttons class="user-mgt">
		<Languages language={$language} on:set-language={setLng} />
		<User on:set-user />
	</Buttons>
</div>
<style lang="scss" global>
.ui.buttons.user-mgt {
	> .button:first-child,
	> .ui.dropdown.button:not(.pointing):not(.floating).active:first-child {
		border-radius: 1em 0 0 1em;
	}
	> .button:last-child,
	.ui.dropdown.button:not(.pointing):not(.floating).active:last-child {
		border-radius: 0 1em 1em 0;
	}
}
</style>