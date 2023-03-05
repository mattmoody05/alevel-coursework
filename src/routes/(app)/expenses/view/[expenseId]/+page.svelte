<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Listbox, Textbox } from '$lib/components/input';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { SmallAlert } from '$lib/components/alert';

	export let data: PageData;
	export let form: ActionData;

	onMount(() => {
		if (form?.message !== undefined) {
			setTimeout(() => {
				// @ts-ignore
				form.message = undefined;
			}, 10000);
		}
	});
</script>

<svelte:head>
	<title>View expense report</title>
</svelte:head>

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

<h3 class="font-bold text-xl">View expense report</h3>

<form class="flex gap-2 flex-col mt-2" method="POST" action="?/updateExpense">
	<Textbox
		value={data.expenseData.date}
		name="date"
		labelText="Date"
		placeholderText="DD/MM/YYYY"
	/>
	<Textbox value={data.expenseData.name} name="name" labelText="Name" placeholderText="Fuel" />
	<Textbox
		value={String(data.expenseData.cost / 100)}
		name="cost"
		labelText="Cost"
		placeholderText="£19.99"
	/>
	<Listbox value={data.expenseData.type} name="type" labelText="Type">
		<option value="Fuel">Fuel</option>
		<option value="Food">Food</option>
		<option value="Activity">Activity</option>
	</Listbox>
	<Textbox
		value={data.expenseData.supportingDocs}
		name="supportingDocs"
		labelText="Supporting documents"
		placeholderText="Link to supporting documents here"
	/>
	<Checkbox
		isChecked={data.expenseData.chargeToParents}
		name="chargeToParents"
		labelText="Charge to parents via invoicing"
	/>
	<div />
	<Button formaction="?/updateExpense" style="submit">Submit</Button>
	<Button formaction="?/deleteExpense" style="danger">Delete expense</Button>
</form>
