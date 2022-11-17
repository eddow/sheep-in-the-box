<script lang="ts">
	import { Spinner } from "sveltestrap";

	export let promise: Promise<any>;
</script>
{#await promise}
	<Spinner size="xl">Loading...</Spinner>
{:then value}
	<slot {value} />
{/await}