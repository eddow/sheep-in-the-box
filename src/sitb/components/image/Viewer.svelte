<script lang="ts">
	import Viewer from 'viewerjs';
	import { createEventDispatcher, onMount } from 'svelte';
	import { dev } from "$app/environment";
	const
		min = dev? '' : '.min',
		dispatch = createEventDispatcher();
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
			},
			hidden(event: CustomEvent) { dispatch('hidden', event.detail); },
			hide(event: CustomEvent) { dispatch('hide', event.detail); },
			move(event: Viewer.MoveEvent) { dispatch('move', event.detail); },
			moved(event: Viewer.MovedEvent) { dispatch('moved', event.detail); },
			play(event: CustomEvent) { dispatch('play', event.detail); },
			ready(event: CustomEvent) { dispatch('ready', event.detail); },
			rotate(event: Viewer.RotateEvent) { dispatch('rotate', event.detail); },
			rotated(event: Viewer.RotatedEvent) { dispatch('rotated', event.detail); },
			scale(event: Viewer.ScaleEvent) { dispatch('scale', event.detail); },
			scaled(event: Viewer.ScaledEvent) { dispatch('scaled', event.detail); },
			show(event: CustomEvent) { dispatch('show', event.detail); },
			shown(event: CustomEvent) { dispatch('shown', event.detail); },
			stop(event: CustomEvent) { dispatch('stop', event.detail); },
			view(event: CustomEvent) { dispatch('view', event.detail); },
			viewed(event: CustomEvent) { dispatch('viewed', event.detail); },
			zoom(event: Viewer.ZoomEvent) { dispatch('zoom', event.detail); },
			zoomed(event: Viewer.ZoomedEvent) { dispatch('zoomed', event.detail); }
		});
	});
</script>
<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.3/viewer{min}.css" />
</svelte:head>
<div class={cls} bind:this={ul}>
	{#each images||[] as image}
		<img data-original={image} src={image+'?128'} alt={image} />
	{/each}
</div>