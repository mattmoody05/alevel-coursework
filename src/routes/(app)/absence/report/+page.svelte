<script>
	import { Button } from '$lib/components/button';
	import { LargeTextbox, Listbox, Textbox } from '$lib/components/input';
</script>

<svelte:head>
	<title>Report absence</title>
</svelte:head>

<h3 class="font-bold text-xl">Report absence</h3>

<div class="flex mt-2 gap-2 flex-col">
	<Listbox labelText="Select child">
		<option>Matt</option>
		<option>Jon</option>
		<option>Holly</option>
		<option>Ella</option>
	</Listbox>
	<Textbox labelText="Start date" placeholderText="Start date" />
	<Textbox labelText="Start date" placeholderText="End date" />
	<Listbox labelText="Select reason">
		<option value="">COVID isolation</option>
	</Listbox>
	<LargeTextbox labelText="Additional information" placeholderText="Type a message..." />
	<Button>Submit</Button>
</div>
