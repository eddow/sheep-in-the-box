<script lang="ts">
	import { I } from "$sitb/intl";
	import { ajax } from "$sitb/ajax";
	import { Col, Input, Form, Field, Button, toast } from "svemantic";

	async function submit(e: CustomEvent) {
		const { values, context } = e.detail, {passCur, passNew} = values;
		let rv = await ajax.put({passCur, passNew});
		if(Math.floor(rv.status/100) === 4)
			toast({message: $I('err.pw.wrong'), class: 'error'});
		else {
			toast({message: $I('msg.pw.changed'), class: 'success'});
			context.reset();
		}
	}
</script>

<div class="ui main container">
	<h3 class="ui top attached segment">{$I('ttl.pw.set')}</h3>
	<Form on:submit={submit} class="two column doubling stackable grid attached vertical bottom aligned basic segment">
		<Col><Field label required name="passCur"><Input type="password" /></Field></Col>
		<Col><Field label required name="passNew" validate="different[passCur]"><Input type="password" /></Field></Col>
		<Col><Field label required name="passCnf" validate="match[passNew]"><Input type="password" /></Field></Col>
		<Col><Button fluid primary submit>{$I('cmd.pw.new')}</Button></Col>
	</Form>
</div>

<style lang="scss">

.main.container {
	position: relative;
	width: 700px !important;
	left: 0;
	margin-left: auto !important;
	margin-right: auto !important;
}

@media only screen and (max-width: 820px) {
	.main.container {
		width: auto !important;
		margin-left: 1em !important;
		margin-right: 1em !important;
	}
}
</style>