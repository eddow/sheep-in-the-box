<script lang="ts">
	import Code from '$sitb/components/form/Code.svelte';
	import Editor from './Editor.svelte'
	import { getClmnCtx } from '../contexts'
	import type { TextType } from '$sitb/constants';

	export let preview: TextType = '';
</script>
<Editor>
	TODO
</Editor>