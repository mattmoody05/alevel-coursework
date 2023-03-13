<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Textbox } from '$lib/components/input';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ActionData } from './$types';

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
	<title>Book time off</title>
</svelte:head>

{#if form?.success}
	<div out:fade>
		<SmallAlert
			style="success"
			body="Time off period successfully created. {form.cancelledSessions
				.length} Sessions were cancelled"
			title="Success"
		/>
	</div>
{/if}

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

<h3 class="font-bold text-xl">Book time off</h3>
<form method="POST" class="flex flex-col gap-2 mt-2" action="?/book">
	<Textbox name="startDate" labelText="Start date" placeholderText="DD/MM/YYYY" />
	<Textbox name="endDate" labelText="End date" placeholderText="DD/MM/YYYY" />
	<div class="py-2">
		<Checkbox name="cancelSessions" labelText="Cancel sessions within time off period" />
	</div>
	<Button style="submit">Submit</Button>
</form>
