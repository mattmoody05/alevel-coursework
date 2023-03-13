<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Listbox, Textbox } from '$lib/components/input';
	import type { ActionData, PageData } from './$types';
	import { SmallAlert } from '$lib/components/alert';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let data: PageData;
	export let form: ActionData;

	let recurringBasis: string = 'weekly';
	let showDaySelection: boolean = true;

	// Shows and gudes the day selection interface based on the recurring basis selected
	$: if (recurringBasis === 'weekly') {
		showDaySelection = true;
	} else {
		showDaySelection = false;
	}

	// Will run when the page is rendered
	onMount(() => {
		// Hides the success alert after 5 seconds
		if (form?.success) {
			setTimeout(() => {
				form.success = false;
			}, 5000);
		}
		// Hides the verification error alert after 10 seconds
		if (form?.message !== undefined) {
			setTimeout(() => {
				form.message = undefined;
			}, 10000);
		}
	});
</script>

<svelte:head>
	<title>Request recurring session</title>
</svelte:head>

{#if form?.success}
	<div out:fade>
		<SmallAlert style="success" body="Recurring session has been created." title="Success" />
	</div>
{/if}

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

<h3 class="font-bold text-xl">Request recurring session</h3>
<form action="?/requestRecurringSession" class="flex flex-col gap-2 mt-2" method="POST">
	<Listbox name="childId" labelText="Select child">
		{#each data.children as child}
			<option value={child.childId}>{child.firstName} {child.lastName}</option>
		{/each}
	</Listbox>
	<Listbox name="recurring-basis" labelText="Select reecurring basis" bind:value={recurringBasis}>
		<option value="weekly">Weekly</option>
		<option value="daily">Daily (Monday - Friday)</option>
	</Listbox>
	{#if showDaySelection}
		<div class="day-selection">
			<span class="text-sm">Select days</span>
			<div class="flex flex-col gap-2 mt-2">
				<div class="grid grid-cols-2 gap-2 items-center">
					<Checkbox name="monday-selected" labelText="Monday" />
					<div class="flex gap-2">
						<div class="w-full">
							<Textbox name="monday-start-time" placeholderText="Start time" />
						</div>
						<div class="w-full">
							<Textbox name="monday-end-time" placeholderText="Finish time" />
						</div>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2 items-center">
					<Checkbox name="tuesday-selected" labelText="Tuesday" />
					<div class="flex gap-2">
						<div class="w-full">
							<Textbox name="tuesday-start-time" placeholderText="Start time" />
						</div>
						<div class="w-full">
							<Textbox name="tuesday-end-time" placeholderText="Finish time" />
						</div>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2 items-center">
					<Checkbox name="wednesday-selected" labelText="Wednesday" />
					<div class="flex gap-2">
						<div class="w-full">
							<Textbox name="wednesday-start-time" placeholderText="Start time" />
						</div>
						<div class="w-full">
							<Textbox name="wednesday-end-time" placeholderText="Finish time" />
						</div>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2 items-center">
					<Checkbox name="thursday-selected" labelText="Thursday" />
					<div class="flex gap-2">
						<div class="w-full">
							<Textbox name="thursday-start-time" placeholderText="Start time" />
						</div>
						<div class="w-full">
							<Textbox name="thursday-end-time" placeholderText="Finish time" />
						</div>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2 items-center">
					<Checkbox name="friday-selected" labelText="Friday" />
					<div class="flex gap-2">
						<div class="w-full">
							<Textbox name="friday-start-time" placeholderText="Start time" />
						</div>
						<div class="w-full">
							<Textbox name="friday-end-time" placeholderText="Finish time" />
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex gap-2">
			<div class="w-full">
				<Textbox name="week-start-time" placeholderText="Start time" />
			</div>
			<div class="w-full">
				<Textbox name="week-end-time" placeholderText="Finish time" />
			</div>
		</div>
	{/if}
	<Button style="submit">Submit request</Button>
</form>
