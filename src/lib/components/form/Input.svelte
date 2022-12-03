<script lang="ts">
	import { T } from "$lib/globals";
	import { Input } from "sveltestrap";
	import { getFrmCtx } from "./utils";

	export let errors: string[] = [];
	export let name: string;
	export let value = '';
	export let checked = false;
	const formInfo = getFrmCtx();
	const { errors: frmErrors } = formInfo;
	let allErrors: string[];
	let placeholder: string;
$:	placeholder = $T('fld.'+name);
$:	allErrors = (errors||[]).concat($frmErrors[name]||[]);
</script>
<Input invalid={!!allErrors.length} {value} {checked} feedback={allErrors} {name} {placeholder} {...$$restProps}>
	<slot />
</Input>