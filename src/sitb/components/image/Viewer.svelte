<script lang="ts" context="module">
	import { I, addScript, addStyleSheet } from '$sitb/globals';
	import { onMount } from 'svelte';
	addStyleSheet('https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.3/viewer.min.css');
</script>
<script lang="ts">
	import Viewer from 'viewerjs';
	export let
		images: string[];
	let ul: HTMLElement,
		gallery: Viewer,
		cls: string = '';
	export {cls as class};
	interface $$Props {
		images: string[];
		class?: string;

		backdrop?: boolean | string;
		button?: boolean;
		className?: string;
		container?: string | HTMLElement;
		filter?: Function;
		fullscreen?: boolean | FullscreenOptions;
		focus?: boolean;
		inheritedAttributes?: string[];
		initialCoverage?: number;
		initialViewIndex?: number;
		inline?: boolean;
		interval?: number;
		keyboard?: boolean;
		loading?: boolean;
		loop?: boolean;
		maxZoomRatio?: number;
		minHeight?: number;
		minWidth?: number;
		minZoomRatio?: number;
		movable?: boolean;
		navbar?: boolean | Viewer.Visibility;
		rotatable?: boolean;
		scalable?: boolean;
		slideOnTouch?: boolean;
		title?: boolean | Viewer.Visibility | Function | [Viewer.Visibility, Function];
		toggleOnDblclick?: boolean;
		toolbar?: boolean | Viewer.Visibility | Viewer.ToolbarOptions;
		tooltip?: boolean;
		transition?: boolean;
		zIndex?: number;
		zIndexInline?: number;
		zoomOnTouch?: boolean;
		zoomOnWheel?: boolean;
		zoomRatio?: number;
		zoomable?: boolean;
	}
	onMount(()=> {
		gallery = new Viewer(ul, {
			...$$restProps,
			url(img: HTMLImageElement) {
				return img.dataset.original || img.src;
			}
		});
	});

</script>
<div class={cls} bind:this={ul}>
	{#each images||[] as image}
		<img data-original={image} src={image+'?128'} alt={image} />
	{/each}
</div>