<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Listbox, NumericUpDown } from '$lib/components/input';
	import { Textbox } from '$lib/components/input';
</script>

<svelte:head>
	<title>Create invoice</title>
</svelte:head>

<h3 class="font-bold text-xl">Create invoice</h3>
<div class="flex flex-col gap-2 mt-2">
	<Listbox labelText="Select child">
		<option value="">Jon</option>
		<option value="">Matthew</option>
		<option value="">Ella</option>
		<option value="">Dan</option>
	</Listbox>
	<Textbox labelText="Start date" placeholderText="DD/MM/YYYY" />
	<Textbox labelText="End date" placeholderText="DD/MM/YYYY" />
	<div class="grid grid-cols-3 gap-4">
		<div class="col-span-2">
			<Textbox labelText="Additional charge" placeholderText="Charge name" />
		</div>
		<div class="flex flex-col justify-end">
			<!-- value "" used to show palceholder message -->
			<!-- use svelte-ignore? -->
			<NumericUpDown placeholderText="£" value="" />
		</div>
	</div>
	<div class="grid grid-cols-3 gap-4">
		<div class="col-span-2">
			<Textbox labelText="Discounts" placeholderText="Disount name" />
		</div>
		<div class="flex flex-col justify-end">
			<!-- value "" used to show palceholder message -->
			<!-- use svelte-ignore? -->
			<NumericUpDown placeholderText="%" value="" />
		</div>
	</div>
	<div class="py-2">
		<Checkbox labelText="Include expenses" />
	</div>
	<Button>Generate invoice</Button>
</div>
