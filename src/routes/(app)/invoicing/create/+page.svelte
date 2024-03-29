<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { LargeTextbox, Listbox, NumericUpDown } from '$lib/components/input';
	import { Textbox } from '$lib/components/input';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// Will run when the page is rendered
	onMount(() => {
		// Hide the success alert after 5 seconds
		if (form?.success) {
			setTimeout(() => {
				form.success = false;
			}, 5000);
		}
		// Hides the validatione error message after 10 seconds
		if (form?.message !== undefined) {
			setTimeout(() => {
				form.message = undefined;
			}, 10000);
		}
	});
</script>

<svelte:head>
	<title>Create invoice</title>
</svelte:head>

{#if form?.success}
	<div out:fade>
		<SmallAlert
			style="success"
			body="Invoice has successfully been created and issued. Invoice total was £{form
				.generatedInvoice.total / 100}"
			title="Success"
		/>
	</div>
{/if}

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

<h3 class="font-bold text-xl">Create invoice</h3>
<form action="?/createInvoice" method="POST" class="flex flex-col gap-2 mt-2">
	<Listbox name="childId" labelText="Select child">
		{#each data.childrenSummary as child}
			<option value={child.childId}
				>{child.firstName} {child.lastName} ({child.parentFirstName} {child.parentLastName})</option
			>
		{/each}
	</Listbox>
	<Textbox name="startDate" labelText="Start date" placeholderText="DD/MM/YYYY" />
	<Textbox name="endDate" labelText="End date" placeholderText="DD/MM/YYYY" />
	<div class="grid grid-cols-3 gap-4">
		<div class="col-span-2">
			<Textbox
				name="additionalChargeName"
				labelText="Additional charge"
				placeholderText="Charge name"
			/>
		</div>
		<div class="flex flex-col justify-end">
			<NumericUpDown name="additionalChargeAmount" placeholderText="£" value="" />
		</div>
	</div>
	<div class="grid grid-cols-3 gap-4">
		<div class="col-span-2">
			<Textbox name="discountName" labelText="Discounts" placeholderText="Disount name" />
		</div>
		<div class="flex flex-col justify-end">
			<NumericUpDown name="discountAmount" placeholderText="%" value="" />
		</div>
	</div>
	<div class="py-2">
		<Checkbox name="includeExpenses" labelText="Include expenses" />
	</div>
	<h3 class="font-bold text-xl">Issue invoice</h3>
	<Listbox name="parentId" labelText="Select parent">
		{#each data.parents as parent}
			<option value={parent.parentId}>{parent.firstName} {parent.lastName}</option>
		{/each}
	</Listbox>
	<Textbox name="dateDue" labelText="Due date" placeholderText="DD/MM/YYYY" />
	<LargeTextbox name="invoiceMessage" labelText="Invoice message" />
	<Button style="submit">Create & issue invoice</Button>
</form>
