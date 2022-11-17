<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { ajax, T, user, alert } from "$lib/globals";
	import type { PageData } from "./$types";
	import { Button, Card, CardBody, CardFooter, CardTitle, FormGroup, Input } from "sveltestrap";

	export let data: PageData;
	const {email, code, exists} = data;
	let pass: string, cnfPass: string, cnfError: string | false;
	function validateCnf() {
		cnfError = cnfPass !== pass && $T('err.pw.conf');	// TODO && !cnfPass.hasFocus: redo all validation
	}
	async function setPW({cancel}: {cancel: ()=> void}) {
		cancel();
		if(cnfPass === pass) {
			goto('/');
			if((await ajax.post({pass}, '', [401])).ok)
				alert({message: $T('msg.pw.code'), color: 'success'});
			else alert({message: $T('err.pw.code'), color: 'danger'});
		}
	}
</script>
<form use:enhance={x=> { setPW(x); }}>
	<Card>
		<CardTitle>{$T('ttl.pw.new')}</CardTitle>
		<CardBody>
			<FormGroup floating label={$T('fld.pw')}>
				<Input required bind:value={pass} placeholder={$T(exists?'fld.pw.new':'fld.pw')} name="password" type="password" style="min-width: 200px;" on:blur={validateCnf} />
			</FormGroup>
			<FormGroup floating label={$T('fld.pw.cnf')}>
				<Input invalid={!!cnfError} feedback={cnfError || ''} required bind:value={cnfPass} placeholder="Confirm new passphrase" name="cnfPass"
					type="password" style="min-width: 200px;" on:change={validateCnf} />
			</FormGroup>
		</CardBody>
		<CardFooter>
			<Button name="submit" color="primary">
				{$T(exists?'cmd.pw.new':'cmd.pw')}
			</Button>
		</CardFooter>
	</Card>
</form>