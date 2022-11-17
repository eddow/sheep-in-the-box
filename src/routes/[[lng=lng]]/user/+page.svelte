<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { ajax, T, user, alert } from "$lib/globals";
	import { Button, Card, CardBody, CardFooter, CardTitle, FormGroup, Input } from "sveltestrap";

$:	if(!$user) goto('/');
	let oldPass: string, cnfPass: string, newPass: string,
		cnfError: string | false;
	function validateCnf() {
		cnfError = cnfPass !== newPass && $T('err.pw.conf');	// TODO && !cnfPass.hasFocus
	}
	async function setPW({cancel}: {cancel: ()=> void}) {
		cancel();
		if(cnfPass === newPass) {
			let rv = await ajax.patch({oldPass, newPass});
			if(Math.floor(rv.status/100) === 4)
				$alert({message: $T('err.pw.wrong'), color: 'danger'});
			else {
				$alert({message: $T('msg.pw.changed'), color: 'success'});
				oldPass = newPass = cnfPass = cnfError = '';
			}
		}
	}
</script>
<form use:enhance={x=> { setPW(x); }}>
	<Card>
		<CardTitle>{$T('ttl.pw.new')}</CardTitle>
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
				{$T('cmd.pw.new')}
			</Button>
		</CardFooter>
	</Card>
</form>