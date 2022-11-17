<script lang="ts">
	import { Button, Icon, Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
	import { setGlobalConfirmCenter, T } from "$lib/globals";

	const timeOut = 6000;	// ms

	let spec: ConfirmSpec = {};
	let confOptions: ConfirmOption[];
	function confirm(content: ConfirmSpec | string, options: ConfirmOption[]) {
		spec = typeof content === 'string' ? {message: content} : content;
		confOptions = options;
		isOpen = true;
		return new Promise(resolve=> { resolver = resolve; });
	};
	let resolver: (v: any)=> void;
	function returnValue(v: any) {
		isOpen = false;
		resolver(v);
	}
	setGlobalConfirmCenter(confirm);
	let isOpen = false;
</script>
<Modal keyboard={true} {isOpen}>
	{#if spec.title}<ModalHeader>{$T(spec.title)}</ModalHeader>{/if}
	{#if spec.message}<ModalBody>{$T(spec.message)}</ModalBody>{/if}
	<ModalFooter>
		{#each confOptions as option}
			<Button color={option.color || 'secondary'} on:click={()=> returnValue(option.value)}>
				{#if option.icon}<Icon name={option.icon} />{/if}
				{$T(option.text||'')}
			</Button>
		{/each}
	</ModalFooter>
</Modal>