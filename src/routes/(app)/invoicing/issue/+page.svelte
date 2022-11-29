<script lang="ts">
	import { Button } from '$lib/components/button';
	import { LargeTextbox, Listbox } from '$lib/components/input';
</script>

<svelte:head>
	<title>Issue invoice</title>
</svelte:head>

<h3 class="font-bold text-xl">Issue invoice</h3>
<div class="flex flex-col gap-2 mt-2">
	<Listbox labelText="Select invoice">
		<option value="">idHere - Matthew - 20/11/22</option>
		<option value="">idHere - Matthew - 20/11/22</option>
		<option value="">idHere - Matthew - 20/11/22</option>
	</Listbox>
	<Listbox labelText="Select parent">
		<option value="">Tracey</option>
		<option value="">Holly</option>
		<option value="">Jon</option>
	</Listbox>
	<LargeTextbox labelText="Invoice message" />
	<Button>Issue invoice</Button>
</div>
