<script lang="ts">
	import { goto } from "$app/navigation";
	import { ajax, T, user } from "$sitb/globals";
	import { Button, Card, CardBody, CardFooter, CardTitle } from "sveltestrap";
	import { object, string } from "yup";
	import Form from "$sitb/components/form/Form.svelte";
	import GInput from "$sitb/components/form/GInput.svelte";
	import { toast } from "svemantic";

$:	if(!$user) goto('/');
	const schema = object({
		passCur: string().required(),
		passNew: string().required(),
		passCnf: string().test(
			'confirmation', $T('err.pw.conf'),
			(value, ctx)=> value === ctx.parent.passNew
		)
	});
	async function submit(e: CustomEvent) {
		const { values, context } = e.detail, {passCur, passNew} = values;
		let rv = await ajax.patch({passCur, passNew});
		if(Math.floor(rv.status/100) === 4)
			toast({message: $T('err.pw.wrong'), class: 'error'});
		else {
			toast({message: $T('msg.pw.changed'), class: 'success'});
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