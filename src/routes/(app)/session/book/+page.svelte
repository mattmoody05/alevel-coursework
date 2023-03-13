<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Listbox, NumericUpDown, Textbox } from '$lib/components/input';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// Will run when the page is rendered
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
	<title>Book session</title>
</svelte:head>

{#if form?.success}
	<div out:fade>
		<SmallAlert
			style="success"
			body="The session for {form?.childData.firstName} {form?.childData
				.lastName} has been created on {form?.createdSession.date} at {form.createdSession
				.startTime} for {String(form.createdSession.length / 60)} hours"
			title="Success"
		/>
	</div>
{/if}

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

<h3 class="font-bold text-xl">Book session</h3>
<form action="?/book" method="POST" class="flex flex-col gap-2">
	<Listbox name="childId" labelText="Select child" value={form?.data?.childId}>
		{#each data.children as child}
			<option value={child.childId}>{child.firstName} {child.lastName}</option>
		{/each}
	</Listbox>
	<Textbox name="date" labelText="Date" placeholderText="DD/MM/YYYY" value={form?.data?.date} />
	<Textbox
		name="startTime"
		labelText="Start time"
		placeholderText="HH:MM"
		value={form?.data?.startTime}
	/>
	<NumericUpDown
		name="length"
		labelText="Session length"
		placeholderText="Hours"
		value={String(form?.data?.length)}
	/>
	{#if data.isAdmin}
		<div class="py-2">
			<Checkbox name="bypassRegs" labelText="Override childcare limits / time off periods" />
		</div>
	{/if}
	<Button style="submit">Book session</Button>
</form>
