<script lang="ts">
import External from './../External.svelte';
	import { Loader, module } from 'svemantic';
	export let
		images: string[];
	let cls: string = '';
	export {cls as class};
	interface $$Props {
		images: string[];
		class?: string;

		width?: number|string,
		minwidth?: number|string,
		maxwidth?: number|string,
		height?: number|string,
		minheight?: number|string,
		maxheight?: number|string,
		ratio?: number|string,
		margin?: number,
		glimpse?: number|string,
		nav?: 'dots'|'thumbs'|false,
		navposition?: 'top'|'bottom',
		navwidth?: string,
		thumbwidth?: number,
		thumbheight?: number,
		thumbmargin?: number,
		thumbborderwidth?: number,
		//thumbposition?: 'top'|'right'|'bottom'|'left',
		allowfullscreen?: boolean,
		fit?: 'contain'|'cover'|'scaledown'|'none',
		thumbfit?: 'contain'|'cover'|'scaledown'|'none',
		transition?: 'slide'|'crossfade'|'dissolve',
		clicktransition?: 'slide'|'crossfade'|'dissolve',
		transitionduration?: number,
		caption?: 'simple'|'overlay'|false,
		hash?: boolean,
		startindex?: number,
		loop?: boolean,
		autoplay?: boolean|number,
		stopautoplayontouch?: boolean,
		keyboard?: boolean,
		arrows?: boolean|'always',
		click?: boolean,
		swipe?: boolean,
		trackpad?: boolean,
		shuffle?: boolean,
		direction?: 'ltr'|'rtl',
		// spinner
		shadow?: boolean,
	}
	const fotorama = module('fotorama', {
		...$$restProps,
	});

</script>
<External lib="https://cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama" module="fotorama" let:loading>
	{#await loading}
		<div class="ui placeholder" style="max-width: 100%;">
			<div class="square image"></div>
		</div>
	{:then ok}
		<div class={cls} use:fotorama>
			{#each images||[] as image}
				<img src={image} alt={image} />
			{/each}
		</div>
	{/await}
</External>