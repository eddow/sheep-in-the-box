<script lang="ts">
	export let data: any[];
</script>
{#each data as item}
	{item.a} is {item.b} <br />
{/each}