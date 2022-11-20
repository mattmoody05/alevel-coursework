<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Listbox, Textbox } from '$lib/components/input';

	export let data: PageData;

	const expenseReportId: string = data.expenseReportId;
</script>

<h3 class="font-bold text-xl">View expense report</h3>

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
