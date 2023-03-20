<script lang="ts">
	import { toast } from 'svemantic';
		import { goto } from "$app/navigation";
	import { ajax, T, } from "$lib/globals";
	import type { PageData } from "./$types";
	import { Button, Card, CardBody, CardFooter, CardTitle, FormGroup, Input } from "sveltestrap";
	import { object, string } from "yup";
	import Form from "$lib/components/form/Form.svelte";
	import GInput from "$lib/components/form/GInput.svelte";

	export let data: PageData;
	const {exists} = data, name = exists ? 'passNew' : 'pass',
		schema = object({
		[name]: string().required(),
		passCnf: string().required().test(
			'confirmation', $T('err.pw.conf'),
			(value, ctx)=> !!value && value === ctx.parent[name]
		)
	});
	async function submit({detail}: CustomEvent) {
		const { values } = detail, {[name]: pass} = values;
		goto('/');
		if((await ajax.post({pass}, '', [401])).ok)
			toast({message: $T('msg.pw.code'), class: 'success'});
		else toast({message: $T('err.pw.code'), class: 'error'});
	}
</script>
<Form {schema} on:submit={submit}>
	<Card>
		<CardTitle>{$T(exists?'ttl.pw.new':'ttl.pw.set')}</CardTitle>
		<CardBody>
			<GInput {name} type="password" style="min-width: 200px;" />
			<GInput name="passCnf" type="password" style="min-width: 200px;" />
		</CardBody>
		<CardFooter>
			<Button name="submit" color="primary">
				{$T(exists?'cmd.pw.new':'cmd.pw')}
			</Button>
		</CardFooter>
	</Card>
</Form>