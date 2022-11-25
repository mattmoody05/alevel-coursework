<script>
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Textbox } from '$lib/components/input';
</script>

<svelte:head>
	<title>Book time off</title>
</svelte:head>

<h3 class="font-bold text-xl">Book time off</h3>
<div class="flex flex-col gap-2 mt-2">
	<Textbox labelText="Start date" placeholderText="DD/MM/YYYY" />
	<Textbox labelText="End date" placeholderText="DD/MM/YYYY" />
	<div class="py-2">
		<Checkbox labelText="Cancel sessions within time off period" />
	</div>
	<Button>Submit</Button>
</div>
