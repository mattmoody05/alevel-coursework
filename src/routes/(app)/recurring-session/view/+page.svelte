<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Listbox, Textbox } from '$lib/components/input';
	import type { LowercaseDay } from '$lib/util/types';
	import { capitaliseFirst, getChildName } from '$lib/util/ui';
	import { fade } from 'svelte/transition';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const dayList: LowercaseDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

	let selectedChildId = data.children[0].childId;

	function getSelectedRecurringSession(childId: string) {
		const requests = data.recurringSessionRequests.filter((req) => req.childId === childId);
		if (requests.length !== 0) {
			return requests[0];
		}
	}

	function getChildParent(parentId: string) {
		// parents is only provided when isAdmin is true, but this function will only be called then so should not be an issue
		// @ts-ignore
		const parents = data.parents.filter((parentData) => parentId === parentData.parentId);
		return parents[0];
	}
</script>

<svelte:head>
	<title>View recurring session</title>
</svelte:head>

{#if form?.success === true}
	<div transition:fade>
		<SmallAlert style="success" body="" title="Success" />
	</div>
{:else if form?.success === false}
	<div transition:fade>
		<SmallAlert
			style="error"
			title="Error"
			body="There were clashing sessions so the recurring session could not be approved."
		/>
		<div class="absolute right-4 top-28">
			<div class="rounded-xl border bg-red-400 border-red-500 text-white z-50 min-w-min w-96 p-3">
				There are the following clashing sessions that the recurring booking would interfere with...
				<ul class="list-disc pb-2">
					{#each form.clashingSessions as clash}
						<li class="ml-4 font-semibold">
							{getChildName(clash.childId, data.children).fullName} - {clash.date} @ {clash.startTime}
						</li>
					{/each}
				</ul>
				<form method="POST" action="?/approveAnyway">
					<input name="childId" type="text" value={form.childId} class="hidden" />
					<Button style="danger">Approve anyway</Button>
				</form>
			</div>
		</div>
	</div>
{/if}

<h3 class="font-bold text-xl">View recurring session</h3>
<form method="POST" class="flex flex-col gap-2 mt-2">
	<Listbox bind:value={selectedChildId} name="childId" labelText="Select child">
		{#each data.children as child}
			{#if data.isAdmin}
				<option value={child.childId}
					>{child.firstName}
					{child.lastName} ({getChildParent(child.parentId).firstName}
					{getChildParent(child.parentId).lastName})</option
				>
			{:else}
				<option value={child.childId}
					>{child.firstName}
					{child.lastName}</option
				>
			{/if}
		{/each}
	</Listbox>
	{#key selectedChildId}
		<!-- lots of potential undefined errors here - cannot be undefined because there is a check with the if statement above - fix later  -->

		{#if getSelectedRecurringSession(selectedChildId) !== undefined}
			{@const currentRequest = getSelectedRecurringSession(selectedChildId)}
			<div>
				<span class="font-bold">Selected basis: </span>
				{#if currentRequest?.recurringBasis === 'weekly'}
					<span>Weekly</span>
				{:else if currentRequest?.recurringBasis === 'daily'}
					<span>Daily (Monday - Friday)</span>
				{/if}
			</div>
			<div class="">
				<span class="font-bold">Approved: </span>
				{currentRequest?.approved ? 'yes' : 'no'}
			</div>
			<div class="">
				<span class="font-bold">Reason: </span>
				{currentRequest?.decisionReason}
			</div>
			<span class="font-bold">Days in recurring session booking:</span>
			{#each dayList as currentDayName}
				{@const daySelected = currentRequest[`${currentDayName}Selected`]}
				<!-- day selected coming from db as 1 or 0 instead of true / false, convert to strict equality later -->
				{#if daySelected == true}
					<div class="bg-gray-100 border border-gray-300 rounded-xl p-2 grid grid-cols-2">
						<div><span class="font-bold">Day: </span> {capitaliseFirst(currentDayName)}</div>
						<div class="flex flex-col">
							<div>
								<span class="font-bold">Start time: </span><span
									>{currentRequest[`${currentDayName}StartTime`]}</span
								>
							</div>
							<div>
								<span class="font-bold">End time: </span><span
									>{currentRequest[`${currentDayName}EndTime`]}</span
								>
							</div>
						</div>
					</div>
				{/if}
			{/each}
			{#if data.isAdmin}
				{#if currentRequest?.approved == true}
					<Button formaction="?/adminDecline" style="danger">Cancel recurring session</Button>
				{:else}
					<Textbox labelText="Reason for decision" name="decision-reason" />

					<div class="flex flex-row gap-2">
						<Button formaction="?/adminDecline" style="danger">Decline request</Button>
						<Button formaction="?/adminApprove" style="submit">Approve request</Button>
					</div>
				{/if}
			{:else}
				<Button formaction="?/parentCancel" style="danger">Cancel recurring session</Button>
			{/if}
		{:else}
			<h3 class="font-bold text-xl">No session request found</h3>
			There is no recurring sessio request found for the selected child, or a child has not been selected.
		{/if}
	{/key}
</form>
