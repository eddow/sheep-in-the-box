<script lang="ts">
	import Ctrl from "./ctrl.svelte";

	let data = [
		{a:1, b: 'one'},
		{a:2, b: 'two'},
		{a:3, b: 'three'},
	];
	function click() {
		let dob = data[1];
		dob.b = '?';
		//data = data;
	}
</script>
<Ctrl data={data} />
<button on:click={click}>Yup</button>

<svelte:head>
	<title>Home</title>
</svelte:head>
