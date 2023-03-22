<script lang="ts">
	import { T } from "$sitb/globals";
	import { Input } from "sveltestrap";
	import { getFrmCtx } from "./utils";

	export let name: string;
	export let value = '';
	export let checked = false;
	export let errors: string[] = [];
	const { errors: frmErrors } = getFrmCtx();
	let allErrors: string[];
$:	allErrors = (errors||[]).concat($frmErrors[name]||[]);
	export let placeholder: string | undefined = undefined;
	let computedPH: string;
$:	computedPH = placeholder === undefined ? $T('fld.'+name) : placeholder;
</script>
<Input invalid={!!allErrors.length} bind:value bind:checked feedback={allErrors} {name} placeholder={computedPH} {...$$restProps}>
	<slot />
</Input>