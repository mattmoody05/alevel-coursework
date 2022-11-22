<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Listbox, Textbox } from '$lib/components/input';
</script>

<svelte:head>
	<title>Report expense</title>
</svelte:head>

<h3 class="font-bold text-xl">Report expense</h3>
<div class="flex gap-2 flex-col">
	<Textbox labelText="Date" placeholderText="DD/MM/YYYY" />
	<Textbox labelText="Name" placeholderText="Fuel" />
	<Textbox labelText="Cost" placeholderText="£19.99" />
	<Listbox labelText="Type">
		<option value="">Fuel</option>
		<option value="">Food</option>
		<option value="">Activity</option>
	</Listbox>
	<Textbox labelText="Supporting documents" placeholderText="File upload here" />
	<Checkbox labelText="Charge to parents via invoicing" />
	<div />
	<Button>Submit</Button>
</div>
