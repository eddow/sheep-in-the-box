<script lang="ts">
	import { Col } from "sveltestrap";
	export let field: boolean = false;
</script>
{#if field}
	<Col xs="12" sm="6" lg="3"><slot /></Col>
{:else}
	<Col xs="12" sm="6" lg="3"><slot /></Col>
{/if}