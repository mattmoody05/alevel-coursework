<script lang="ts">
	import { enhance } from '$app/forms';
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Listbox, NumericUpDown, Textbox } from '$lib/components/input';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	onMount(() => {
		if (form?.sessionAllowed !== undefined) {
			setTimeout(() => {
				// @ts-ignore
				form.sessionAllowed = undefined;
			}, 10000);
		}
		if (form?.message !== undefined) {
			setTimeout(() => {
				// @ts-ignore
				form.message = undefined;
			}, 10000);
		}
	});
</script>

<svelte:head>
	<title>Check availability</title>
</svelte:head>

<div transition:fade>
	{#if form?.sessionAllowed === true}
		<SmallAlert
			style="success"
			title="Availability"
			body="A session with the details that have been input is available. To book the session, please navigate to the create session page"
		/>
	{:else if form?.sessionAllowed === false}
		<SmallAlert
			style="error"
			title="Availability"
			body="Unfortunately, a session with the details that have been input is not available. Please try again with a different time or date selected. "
		/>
	{/if}
</div>

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

<h3 class="font-bold text-xl">Check availability</h3>
<form action="?/checkAvailability" method="POST" class="flex flex-col gap-2" use:enhance>
	<Listbox name="childId" labelText="Select child">
		{#each data.children as child}
			<option value={child.childId}>{child.firstName} {child.lastName}</option>
		{/each}
	</Listbox>
	<Textbox name="date" placeholderText="DD/MM/YYYY" labelText="Date" />
	<Textbox name="start-time" placeholderText="HH:MM" labelText="Start time" />
	<NumericUpDown name="length" labelText="Session length" />
	<Button style="submit">Check</Button>
</form>
