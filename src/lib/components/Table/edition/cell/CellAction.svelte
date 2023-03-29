<script lang="ts">
	import { Button, Loader } from "svemantic";
	import { getEdtnCtx } from "../contexts";

	const { editing } = getEdtnCtx();
</script>
<Button tiny color="yellow" cancel icon="times" />
<Button tiny primary submit icon="save outline" />
<Loader inverted loading={$editing === 'working'} />