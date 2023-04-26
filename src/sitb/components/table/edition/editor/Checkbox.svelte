<script lang="ts">
	import Editor from './Editor.svelte'
	import { Checkbox, Icon } from 'svemantic';
	import { getClmnCtx, getEdtnCtx } from '../contexts';

	const
		{ dialog } = getEdtnCtx();
	const
		{ field, title } = getClmnCtx(),
		{ name } = field || {name: ''};
	console.assert(field, 'Automatic edition requires field name');
	export let value: boolean;
// TODO always editable in cell-edit -> no ' Editor'
// TODO Not even tested/used
</script>
<Editor {...$$restProps}>
	<Icon slot="display" icon={value?'check':'times'} />
	<Checkbox bind:value {name} label={dialog?$title:''} />
</Editor>