<script lang="ts">
	import { goto } from "$app/navigation";
	import { ajax, T, user, alert } from "$lib/globals";
	import { Button, Card, CardBody, CardFooter, CardTitle } from "sveltestrap";
	import { object, string } from "yup";
	import Form from "$lib/components/form/Form.svelte";
	import GInput from "$lib/components/form/GInput.svelte";
	import type { FelteSubmitEvent } from "felte";

$:	if(!$user) goto('/');
	const schema = object({
		passCur: string().required(),
		passNew: string().required(),
		passCnf: string().required().test(
			'confirmation', $T('err.pw.conf'),
			(value, ctx)=> !!value && value === ctx.parent.passNew
		)
	});
	async function submit(e: CustomEvent) {
		const { values, context } = e.detail, {passCur, passNew} = values;
		let rv = await ajax.patch({passCur, passNew});
		if(Math.floor(rv.status/100) === 4)
			alert({message: $T('err.pw.wrong'), color: 'danger'});
		else {
			alert({message: $T('msg.pw.changed'), color: 'success'});
			context.reset();
		}
	}
</script>
<Form {schema} on:submit={submit}>
	<Card>
		<CardTitle>{$T('ttl.pw.new')}</CardTitle>
		<CardBody>
			<GInput name="passCur" type="password" style="min-width: 200px;" autofocus />
			<GInput name="passNew" type="password" style="min-width: 200px;" />
			<GInput name="passCnf" type="password" style="min-width: 200px;" />
		</CardBody>
		<CardFooter>
			<Button name="submit" color="primary">
				{$T('cmd.pw.new')}
			</Button>
		</CardFooter>
	</Card>
</Form>