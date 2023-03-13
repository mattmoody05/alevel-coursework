<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { LargeTextbox, Listbox, Textbox } from '$lib/components/input';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// Will be run when the page is rendered
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
	<title>Report absence</title>
</svelte:head>

{#if form?.success}
	<div transition:fade>
		<SmallAlert
			style="success"
			body="Absense report successfully submitted. {form?.sessionsMarkedAsAbsent} sessions have been affected. "
			title="Success"
		/>
	</div>
{/if}

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

<h3 class="font-bold text-xl">Report absence</h3>

<form action="?/createReport" method="POST" class="flex mt-2 gap-2 flex-col">
	<Listbox name="childId" labelText="Select child">
		{#each data.children as child}
			<option value={child.childId}>{child.firstName} {child.lastName}</option>
		{/each}
	</Listbox>
	<Textbox name="startDate" labelText="Start date" placeholderText="DD/MM/YYYY" />
	<Textbox name="endDate" labelText="Start date" placeholderText="DD/MM/YYYY" />
	<Listbox name="reason" labelText="Select reason">
		<option value="Covid isolation">COVID isolation</option>
		<option value="48 hour sickness waiting period">48 hour sickness waiting period</option>
		<option value="General illness">General illness</option>
		<option value="Doctors / dentist appointment">Doctors / dentist appointment</option>
		<option value="Other">Other (please specify below)</option>
	</Listbox>
	<LargeTextbox
		name="additionalInformation"
		labelText="Additional information"
		placeholderText="Type a message..."
	/>
	<Button style="submit">Submit</Button>
</form>
