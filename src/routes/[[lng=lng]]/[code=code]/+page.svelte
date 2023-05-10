<script lang="ts">
	import { Col, Input, Form, Field, Button, toast } from "svemantic";
	import { goto } from "$app/navigation";
	import { I } from "$sitb/intl";
	import { ajax } from "$sitb/ajax";
	import type { PageData } from "./$types";

	export let data: PageData;
	const {exists} = data, name = exists ? 'passNew' : 'pass';
	async function submit({detail}: CustomEvent) {
		const { values } = detail, {[name]: pass} = values;
		goto('/');
		if((await ajax.post({pass}, '', [401])).ok)
			toast({message: $I('msg.pw.code'), class: 'success'});
		else toast({message: $I('err.pw.code'), class: 'error'});
	}
</script>
<div class="ui main container">
	<h3 class="ui top attached segment">{$I(exists?'ttl.pw.new':'ttl.pw.set')}</h3>
	<Form on:submit={submit} class="two column doubling stackable grid attached vertical bottom aligned basic segment">
		<Col><Field label required {name}><Input type="password" /></Field></Col>
		<Col><Field label required name="passCnf" validate={`match[${name}]`}><Input type="password" /></Field></Col>
		<Col sixteen><Button fluid primary submit>{$I(exists?'cmd.pw.new':'cmd.pw')}</Button></Col>
	</Form>
</div>