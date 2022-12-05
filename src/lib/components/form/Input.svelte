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
	export let placeholder: string | undefined = undefined;
	let computedPH: string;
$:	computedPH = placeholder === undefined ? $T('fld.'+name) : placeholder;
$:	allErrors = (errors||[]).concat($frmErrors[name]||[]);
</script>
<Input invalid={!!allErrors.length} {value} {checked} feedback={allErrors} {name} placeholder={computedPH} {...$$restProps}>
	<slot />
</Input>