<script lang="ts">
	import { I } from "$sitb/intl";

	export let title: string;
	
</script>
<div class="ui wide container">
	<h1 class="ui top attached centered block header">
		{$I(title)}
		<slot name="config" />
	</h1>
	<slot />
</div>