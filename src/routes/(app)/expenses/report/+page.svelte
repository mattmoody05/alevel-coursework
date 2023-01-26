<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Listbox, Textbox } from '$lib/components/input';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ActionData } from './$types';

	export let form: ActionData;

	onMount(() => {
		if (form?.success) {
			setTimeout(() => {
				// @ts-ignore
				form.success = false;
			}, 5000);
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
	<!-- File upload is currently not functional -->
	<Textbox labelText="Supporting docs" name="supportingDocsPath" />
	<Checkbox name="chargeParents" labelText="Charge to parents via invoicing" />
	<div />
	<Button style="submit">Submit</Button>
</form>
