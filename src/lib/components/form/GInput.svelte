<script lang="ts">
	import { T } from "$lib/globals";
	import { FormGroup } from "sveltestrap";
	import { exclude } from "../utils/exclude";
	import { prefixFilter } from "../utils/prefixFilter";
	import Input from "./Input.svelte";

	export let name: string;
	let label: string;
$:	label = $T('fld.'+name);
</script>
<FormGroup floating {label} {...prefixFilter($$restProps, 'fg$')}>
	<Input {name} {...exclude($$restProps, ['fg$'])} />
</FormGroup>