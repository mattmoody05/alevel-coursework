<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Listbox, Textbox } from '$lib/components/input';
	import { SessionSummary } from '$lib/components/summaries';
	import { getDateFromLocaleString } from '$lib/util/date';
	import type { SessionTable } from '$lib/util/db';
	import { getChildName } from '$lib/util/ui';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;

	let visibleSessions: SessionTable[] = data.sessions;
	let filterDate: string = '';
	let sortDate: boolean = false;
	let filterChild: string = 'default';
	let filterParent: string = 'default';

	// Will run when the page is rendered
	onMount(() => {
		// Hides the redirect alert after 5 seconds
		if (data.redirectFrom !== undefined) {
			setTimeout(() => {
				data.redirectFrom = undefined;
			}, 5000);
		}
	});

	// Gets the corresponding parentId given a childId
	// Returns an empty string if the parent could not be found
	function getParentId(childId: string): string {
		for (let i = 0; i < data.children.length; i++) {
			const currentChild = data.children[i];
			if (currentChild.childId === childId) {
				return currentChild.parentId;
			}
		}
		return '';
	}

	function updateFilters() {
		// Working variable is the sessions that the filters are currently working with
		// Working is initially set to be all the sessions provided from the database
		// Each time a sort is selected, working will be what is left in the array after the sort

		// Innerworking starts with no elements in the array, and all matching elements within working array will be added to it
		// Innerworking is only necessary within filters, not sorts

		// At the end, visibleSessions is set to working as it will be the result of all the filters that are active

		let working: SessionTable[] = data.sessions;

		// If date sort is selected, a quicksort algorithm is used to sort by the date field of the sessions
		if (sortDate === true) {
			function quickSort(arr: SessionTable[]): SessionTable[] {
				if (arr.length <= 1) {
					return arr; // Base case: an array of length 1 is already sorted
				}

				function getDateInt(session: SessionTable) {
					return getDateFromLocaleString(session.date).getTime();
				}

				// Choose a pivot element
				const pivotIndex = Math.floor(arr.length / 2);
				const pivot = arr[pivotIndex];

				// Partition the array around the pivot
				let less: SessionTable[] = [];
				let greater: SessionTable[] = [];
				for (let i = 0; i < arr.length; i++) {
					if (i === pivotIndex) {
						continue; // Skip the pivot element
					}
					if (getDateInt(arr[i]) < getDateInt(pivot)) {
						less = [...less, arr[i]];
					} else {
						greater = [...greater, arr[i]];
					}
				}

				// Recursively sort the two partitions
				const sortedLess = quickSort(less);
				const sortedGreater = quickSort(greater);

				// Combine the sorted partitions with the pivot element
				return [...sortedLess, pivot, ...sortedGreater];
			}

			working = quickSort(working);
		}

		// If a value is specified in the date filter text box, a linear search is used to filter by date
		if (filterDate !== '') {
			let innerWorking: SessionTable[] = [];
			for (let i = 0; i < working.length; i++) {
				const currentSession = working[i];
				if (currentSession.date === filterDate) {
					innerWorking = [...innerWorking, currentSession];
				}
			}
			working = innerWorking;
		}

		// If a child is selected in the filter child list box, a linear search is used to filter by child
		if (filterChild !== 'default') {
			let innerWorking: SessionTable[] = [];
			for (let i = 0; i < working.length; i++) {
				const currentSession = working[i];
				if (currentSession.childId === filterChild) {
					innerWorking = [...innerWorking, currentSession];
				}
			}
			working = innerWorking;
		}

		// If a parent is selected in the filter parent list box, a linear search is used to filter by parent
		if (filterParent !== 'default') {
			let innerWorking: SessionTable[] = [];
			for (let i = 0; i < working.length; i++) {
				const currentSession = working[i];
				const sessionParentId = getParentId(currentSession.childId);
				if (sessionParentId === filterParent) {
					innerWorking = [...innerWorking, currentSession];
				}
			}
			working = innerWorking;
		}

		// Visible sessions array is set to the working array
		// The working array is the result of all the sorts and filters being carried out
		visibleSessions = working;
	}

	let showFilters: boolean = true;
	function toggleShowFilters() {
		showFilters = !showFilters;
	}
</script>

<svelte:head>
	<title>View sessions</title>
</svelte:head>

{#if data.redirectFrom}
	<div out:fade>
		<SmallAlert
			style="success"
			body="The session has been successfully {data.redirectFrom === 'cancel-session'
				? 'cancelled'
				: 'updated'}"
			title="Success"
		/>
	</div>
{/if}

<h3 class="font-bold text-xl">View sessions</h3>

<div class="py-4">
	<button on:click={toggleShowFilters} class="opacity-50 text-sm">
		<i class="fa-solid fa-arrow-{showFilters ? 'up' : 'down'}" />
		{showFilters ? 'Hide' : 'Show'} filters and sorts
	</button>
</div>
{#if showFilters === true}
	<div class="flex flex-col gap-2">
		<div class="grid {data.isAdmin ? 'grid-cols-4' : 'grid-cols-3'} items-center gap-4">
			<Textbox placeholderText="DD/MM/YYYY" labelText="Date filter" bind:value={filterDate} />
			<Checkbox labelText="Sort by date" bind:isChecked={sortDate} />
			<Listbox labelText="Child filter" bind:value={filterChild}>
				{#each data.children as child}
					<option value={child.childId}>{child.firstName}</option>
				{/each}
			</Listbox>
			{#if data.isAdmin === true}
				<Listbox labelText="Parent filter" bind:value={filterParent}>
					{#each data.parents as parent}
						<option value={parent.parentId}>{parent.firstName} {parent.lastName}</option>
					{/each}
				</Listbox>
			{/if}
		</div>
		<Button on:click={updateFilters}>Update results</Button>
	</div>
{/if}

<div class="grid grid-cols-3 lg:grid-cols-5 p-2 rounded-xl text-sm opacity-50 pt-4">
	<span>Name</span>
	<span>Date</span>
	<span class="hidden lg:block">Time</span>
	<span>Length</span>
</div>
<div class="flex flex-col gap-2">
	{#each visibleSessions as session}
		<SessionSummary
			childName={getChildName(session.childId, data.children).firstName}
			date={session.date}
			length={session.length}
			sessionId={session.sessionId}
			time={session.startTime}
		/>
	{/each}
</div>
