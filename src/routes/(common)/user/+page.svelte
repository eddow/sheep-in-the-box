<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { getContext } from "svelte";
	import { Button, Card, CardBody, CardFooter, CardTitle, FormGroup, Input } from "sveltestrap";

	const user = getContext<SvelteStore<any>>('user');
$:	if(!$user) goto('/');	// TODO fails on SSR
	const alert: (spec: AlertSpec)=> void = getContext('alert');
	let oldPass: string, cnfPass: string, newPass: string,
		cnfError: string | false;
	function validateCnf() {
		cnfError = cnfPass !== newPass && "Wrong confirmation";
	}
	async function setPW({cancel}: {cancel: ()=> void}) {
		cancel();
		if(cnfPass === newPass) {
			let rv = await fetch('/user', {
				method: 'PATCH',
				body: JSON.stringify({oldPass, newPass})
			});
			if(Math.floor(rv.status/100) === 4)
				alert({message: 'Wrong passphrase', color: 'danger'});
			else {
				alert({message: 'Passphrase changed', color: 'success'});
				oldPass = newPass = cnfPass = cnfError = '';
			}
		}
	}
</script>
<form use:enhance={x=> { setPW(x); }}>
	<Card>
		<CardTitle>Change passphrase</CardTitle>
		<CardBody>
			<FormGroup floating label="Current passphrase">
				<Input required bind:value={oldPass} placeholder="Current passphrase" name="oldPass" type="password" style="min-width: 200px;" autofocus />
			</FormGroup>
			<FormGroup floating label="New passphrase">
				<Input required bind:value={newPass} placeholder="New passphrase" name="password" type="password" style="min-width: 200px;" on:blur={validateCnf} />
			</FormGroup>
			<FormGroup floating label="Confirm new passphrase">
				<Input invalid={!!cnfError} feedback={cnfError || ''} required bind:value={cnfPass} placeholder="Confirm new passphrase" name="cnfPass"
					type="password" style="min-width: 200px;" on:change={validateCnf} />
			</FormGroup>
		</CardBody>
		<CardFooter>
			<Button name="submit" color="primary">
				Set new passphrase
			</Button>
		</CardFooter>
	</Card>
</form>