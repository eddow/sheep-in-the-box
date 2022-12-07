<script context="module" lang="ts">
	//https://svelte.dev/repl/c7094fb1004b440482d2a88f4d1d7ef5?version=3.14.0
	export interface Option {
		text: string;
		value: string;
	};
</script>
<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { FormFeedback } from 'sveltestrap';
	import { getFrmCtx } from './utils';
	export let id: string = '';
	export let selected: string[] = [];
	export let readonly = false;
	export let placeholder = '';
	export let name: string = '';

	let input: HTMLInputElement,
		inputValue: string,
		options: Option[] = [],
		activeOption: Option|undefined,
		showOptions: boolean|string = false,
		selection: Record<string, Option> = {},
		first = true,
		slot: HTMLSelectElement;
	const iconClearPath = 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z';

	onMount(() => {
		slot.querySelectorAll('option').forEach(o => {
			o.selected && !selected.includes(o.value) && (selected = [...selected, o.value]);
			options = [...options, {value: o.value, text: o.textContent||o.value}]
		});
		selected && (selection = options.reduce((obj, op) => selected.includes(op.value) ? {...obj, [op.value]: op} : obj, {}));
		first = false;
	});

// Commented to try if no bugs: allows `values` to be R/W instead of R-O
// TODO Remove the `First` variable when validated
	$: /*if (!first)*/ selected = Object.values(selection).map(o => o.value);
	$: filtered = options.filter(o => inputValue ? o.text.toLowerCase().includes(inputValue.toLowerCase()) : o);
	$: if (activeOption && !filtered.includes(activeOption) || !activeOption && inputValue) activeOption = filtered[0];

	let formInput: HTMLInputElement;
	export let value: string = '',
		listValue: (o: string[])=> string = (vs: string[])=> vs.join(' ');
	$: {
		value = listValue(selected);
		if(formInput) formInput.dispatchEvent(new Event('input', {bubbles:true}));
	}
	export let errors: string[] = [];
	const { errors: frmErrors } = getFrmCtx();
	let allErrors: string[], invalid: boolean = false;
	$: {
		allErrors = (errors||[]).concat($frmErrors[name]||[]);
		invalid = !!allErrors.length;
	}

	function add(token: Option) {
		if (!readonly) selection[token.value] = token;
	}

	function remove(value: string) {
		if (!readonly) {
			const {[value]: val, ...rest} = selection;
			selection = rest;
		}
	}

	function optionsVisibility(show: boolean|string) {
		if (readonly) return;
		if (typeof show === 'boolean') {
			showOptions = show;
			show && input.focus();
		} else {
			showOptions = !showOptions;
		}
		if (!showOptions) {
			activeOption = undefined;
		}
	}

	function handleKeyup(e: KeyboardEvent) {
		if (e.keyCode === 13) {
			Object.keys(selection).includes(activeOption!.value) ? remove(activeOption!.value) : add(activeOption!);
			inputValue = '';
		}
		if ([38,40].includes(e.keyCode)) { // up and down arrows
			const increment = e.keyCode === 38 ? -1 : 1;
			const calcIndex = filtered.indexOf(activeOption!) + increment;
			activeOption = calcIndex < 0 ? filtered[filtered.length - 1]
				: calcIndex === filtered.length ? filtered[0]
				: filtered[calcIndex];
		}
	}

	function handleBlur(e: Event) {
		optionsVisibility(false);
	}

	function handleTokenClick(e: MouseEvent) {
		let target = <HTMLElement>e.target;
		if (target.closest('.token-remove')) {
			e.stopPropagation();
			remove((<HTMLElement>target.closest('.token')).dataset.id!);
		} else if (target.closest('.remove-all')) {
			selection = {};
			inputValue = '';
		} else {
			optionsVisibility(true);
		}
	}

	function handleOptionMousedown(e: MouseEvent) {
		const value = (<HTMLElement>e.target).dataset.value!;
		if (selection[value]) {
			remove(value);
		} else {
			add(options.filter(o => o.value === value)[0]);
			input.focus();
		}
	}
</script>

<div class="multiselect form-control" class:is-invalid={invalid} class:readonly>
	{#if name}<input type="hidden" bind:this={formInput} {name} {value} />{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="tokens" class:showOptions on:click={handleTokenClick}>
		{#each Object.values(selection) as s}
			<div class="token" data-id="{s.value}">
				<span>{s.text}</span>
				{#if !readonly}
					<div class="token-remove" title="Remove {s.text}">
						<svg class="icon-clear" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
							<path d="{iconClearPath}"/>
						</svg>
					</div>
				{/if}
			</div>
		{/each}
		<div class="actions">
			{#if !readonly}
				<input id={id} autocomplete="off" bind:value={inputValue} bind:this={input} on:keyup={handleKeyup} on:blur={handleBlur} placeholder={placeholder}/>
				<div class="remove-all" title="Remove All" class:hidden={!Object.keys(selection).length}>
					<svg class="icon-clear" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
						<path d="{iconClearPath}"/>
					</svg>
				</div>
				<svg class="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M5 8l4 4 4-4z"></path></svg>
			{/if}
		</div>
	</div>

	<select bind:this={slot} type="multiple" class="hidden"><slot></slot></select>
	
	{#if showOptions}
		<ul class="options" transition:fly="{{duration: 200, y: 5}}" on:mousedown|preventDefault={handleOptionMousedown}>
			{#each filtered as option}
				<li class:selected={selection[option.value]} class:active={activeOption === option} data-value="{option.value}">
					<slot name="option" selected={selection[option.value]} {option}>
						{option.text}
					</slot>
				</li>
			{/each}
		</ul>
	{/if}
</div>
{#each allErrors as msg}
	<FormFeedback valid={!invalid}>{msg}</FormFeedback>
{/each}

<style>
	.multiselect {
		background-color: white;
		border-bottom: 1px solid hsl(0, 0%, 70%);
		position: relative;
	}
	.multiselect:not(.readonly):hover {
		border-bottom-color: hsl(0, 0%, 50%);
	}

	.tokens {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		position: relative;
	}
	.tokens::after {		
		background: none repeat scroll 0 0 transparent;
		bottom: -1px;
		content: "";
		display: block;
		height: 2px;
		left: 50%;
		position: absolute;
		background: hsl(45, 100%, 51%);
		transition: width 0.3s ease 0s, left 0.3s ease 0s;
		width: 0;
	}
	.tokens.showOptions::after { 
		width: 100%; 
		left: 0; 
	}
	.token {
		align-items: center;
		background-color: hsl(214, 17%, 92%);
		border-radius: 1.25rem;
		display: flex;
		margin: .25rem .5rem .25rem 0;
		max-height: 1.3rem;
		padding: .25rem .5rem .25rem .5rem;
		transition: background-color .3s;
		white-space: nowrap;
	}
	.token:hover {
		background-color: hsl(214, 15%, 88%);
	}
	.readonly .token {
		color: hsl(0, 0%, 40%);
	}
	.token-remove, .remove-all {
		align-items: center;
		background-color: hsl(214, 15%, 55%);
		border-radius: 50%;
		color: hsl(214, 17%, 92%);
		display: flex;
		justify-content: center;
		height: 1.25rem;
		margin-left: .25rem;
		min-width: 1.25rem;
	}
	.token-remove:hover, .remove-all:hover {
		background-color: hsl(215, 21%, 43%);
		cursor: pointer;
	}

	.actions {
		align-items: center;
		display: flex;
		flex: 1;
		min-width: 15rem;
	}

	input {
		border: none;
		font-size: 1.5rem;
		line-height: 1.5rem;
		margin: 0;
		outline: none;
		padding: 0;
		width: 100%;
	}

	.dropdown-arrow path {
		fill: hsl(0, 0%, 70%);
	}
	.multiselect:hover .dropdown-arrow path {
		fill: hsl(0, 0%, 50%);
	}

	.icon-clear path {
		fill: white;
	}

	.options {
		box-shadow: 0px 2px 4px rgba(0,0,0,.1), 0px -2px 4px rgba(0,0,0,.1);
		left: 0;
		list-style: none;
		margin-block-end: 0;
		margin-block-start: 0;
		max-height: 70vh;
		overflow: auto;
		padding-inline-start: 0;
		position: absolute;
		top: calc(100% + 1px);
		width: 100%;
	}
	li {
		background-color: white;
		cursor: pointer;
		padding: .5rem;
	}
	li:last-child {
		border-bottom-left-radius: .2rem;
		border-bottom-right-radius: .2rem;
	}
	li:not(.selected):hover {
		background-color: hsl(214, 17%, 92%);
	}
	li.selected {
		background-color: hsl(232, 54%, 41%);
		color: white;
	}
	li.selected:nth-child(even) {
		background-color: hsl(232, 50%, 45%);
		color: white;
	}
	li.active {
		background-color: hsl(214, 17%, 88%);
	}
	li.selected.active, li.selected:hover {
		background-color: hsl(232, 48%, 50%);
	}

	.hidden {
		display: none;
	}
</style>
