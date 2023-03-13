<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Listbox, Textbox } from '$lib/components/input';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ActionData } from './$types';

	export let form: ActionData;

	// Will run when the page is returned
	onMount(() => {
		// Hides the success alert after 5 seconds
		if (form?.success) {
			setTimeout(() => {
				form.success = false;
			}, 5000);
		}
		// Hides the validation error alert after 10 seconds
		if (form?.message !== undefined) {
			setTimeout(() => {
				form.message = undefined;
			}, 10000);
		}
	});
</script>

<svelte:head>
	<title>Report expense</title>
</svelte:head>

{#if form?.success}
	<div out:fade>
		<SmallAlert style="success" title="Success" body="Expense report has been created" />
	</div>
{/if}

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

<h3 class="font-bold text-xl">Report expense</h3>
<form action="?/createReport" method="POST" class="flex gap-2 flex-col">
	<Textbox name="date" labelText="Date" placeholderText="DD/MM/YYYY" />
	<Textbox name="expenseName" labelText="Name" placeholderText="Fuel" />
	<Textbox name="cost" labelText="Cost" placeholderText="£19.99" />
	<Listbox name="type" labelText="Type">
		<option value="Fuel">Fuel</option>
		<option value="Food">Food</option>
		<option value="Activity">Activity</option>
	</Listbox>
	<Textbox
		labelText="Supporting docs"
		name="supportingDocsPath"
		placeholderText="Link to supporting documents"
	/>
	<Checkbox name="chargeParents" labelText="Charge to parents via invoicing" />
	<div />
	<Button style="submit">Submit</Button>
</form>
