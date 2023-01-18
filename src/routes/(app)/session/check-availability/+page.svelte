<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Listbox, NumericUpDown, Textbox } from '$lib/components/input';
</script>

<svelte:head>
	<title>Check availability</title>
</svelte:head>

<h3 class="font-bold text-xl">Check availability</h3>
<div class="flex flex-col gap-2">
	<Listbox labelText="Select child">
		<option value="">Jon</option>
		<option value="">Tracey</option>
		<option value="">Matthew</option>
	</Listbox>
	<Textbox placeholderText="DD/MM/YYYY" labelText="Date" />
	<Textbox placeholderText="HH:MM" labelText="Start time" />
	<NumericUpDown labelText="Session length" />
	<Button>Check</Button>
</div>
