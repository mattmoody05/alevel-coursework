<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Listbox, NumericUpDown, Textbox } from '$lib/components/input';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
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

<h3 class="font-bold text-xl">Book session</h3>
<form method="POST" class="flex flex-col gap-2">
	<Listbox name="childId" labelText="Select child">
		{#each data.children as child}
			<option value={child.childId}>{child.firstName} {child.lastName}</option>
		{/each}
	</Listbox>
	<Textbox name="date" labelText="Date" placeholderText="DD/MM/YYYY" />
	<Textbox name="startTime" labelText="Start time" placeholderText="HH:MM" />
	<NumericUpDown name="length" labelText="Session length" placeholderText="Hours" value="" />
	<Button style="submit">Book session</Button>
</form>
