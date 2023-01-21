<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Listbox } from '$lib/components/input';
	import { capitaliseFirst } from '$lib/util/ui';
	import type { PageData } from './$types';

	export let data: PageData;

	type days = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
	const dayList: days[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

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
				<div class="flex flex-row gap-2">
					{#if currentRequest?.approved == true}
						<Button formaction="?/adminDecline" style="danger">Cancel recurring session</Button>
					{:else}
						<Button formaction="?/adminDecline" style="danger">Decline request</Button>
						<Button formaction="?/adminApprove" style="submit">Approve request</Button>
					{/if}
				</div>
			{:else}
				<Button formaction="?/parentCancel" style="danger">Cancel recurring session</Button>
			{/if}
		{:else}
			<h3 class="font-bold text-xl">No session request found</h3>
			There is no recurring sessio request found for the selected child, or a child has not been selected.
		{/if}
	{/key}
</form>
