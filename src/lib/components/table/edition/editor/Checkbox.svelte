<script lang="ts">
	import Editor from './Editor.svelte'
	import { Checkbox, Icon } from 'svemantic';
	import { getClmnCtx, getEdtnCtx } from '../contexts';

	const { dialog } = getEdtnCtx();
	const { field } = getClmnCtx();
	export let value: boolean;
	const {name, text: title} = field;
// TODO always editable in cell-edit ?
// TODO Not even tested
</script>
<Editor {...$$restProps}>
	<Icon slot="display" icon={value?'check':'times'} />
	<Checkbox bind:value name={name} label={dialog?$title:''} />
</Editor>