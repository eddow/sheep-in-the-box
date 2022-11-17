<script lang="ts">
	import { Alert } from "sveltestrap";

	const timeOut = 6000;	// ms

	export const alert = (desc: AlertSpec | string)=> {
		if(typeof desc === 'string') desc = {message: desc};
		let alert = Object.assign({color: 'info'}, desc);
		alerts = [...alerts, alert];
		setTimeout(()=> {
			const ndx = alerts.indexOf(alert);
			if(~ndx)
				alerts = alerts.slice(0, ndx).concat(alerts.slice(ndx+1));
		}, timeOut);
	};
	let alerts: AlertSpec[] = [];
</script>
<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
	{#each alerts as {message, color, title}}
		<Alert dismissible {color} fade={true}>
			{#if title}<h4>{title}</h4>{/if}
			{message}
		</Alert>
	{/each}
</div>