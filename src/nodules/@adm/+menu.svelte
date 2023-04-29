<script lang="ts">
	import { I } from "$sitb/intl";
	import { Dropdown, LinkItem, Menu } from "svemantic";

</script>
<Dropdown class="icon button" icon={['users', 'corner cog']}>
	<Menu vertical>
		<LinkItem icon={['user', 'corner cog']} href="/users">{$I('ttl.users')}</LinkItem>
	</Menu>
</Dropdown>