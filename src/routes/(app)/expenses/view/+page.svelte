<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Listbox, Textbox } from '$lib/components/input';
	import { ExpenseSummary } from '$lib/components/summaries';
	import { getDateFromLocaleString } from '$lib/util/date';
	import type { ExpenseTable } from '$lib/util/db';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;

	onMount(() => {
		if (data.redirectFrom !== undefined) {
			setTimeout(() => {
				// @ts-ignore
				data.redirectFrom = undefined;
			}, 5000);
		}
	});

	let sortDate: boolean = false;
	let filterType: string = 'default';
	let filterDate: string;
	let filterChargeStatus = 'default';

	let visibleExpenses = data.expenses;

	function updateFilters() {
		let working: ExpenseTable[] = data.expenses;
		if (sortDate === true) {
			function quickSort(arr: ExpenseTable[]): ExpenseTable[] {
				if (arr.length <= 1) {
					// Base case: an array of length 1 is already sorted
					return arr;
				}

				function getDateInt(expense: ExpenseTable) {
					return getDateFromLocaleString(expense.date).getTime();
				}

				// Choose a pivot element
				const pivotIndex = Math.floor(arr.length / 2);
				const pivot = arr[pivotIndex];

				// Partition the array around the pivot
				let less: ExpenseTable[] = [];
				let greater: ExpenseTable[] = [];
				for (let i = 0; i < arr.length; i++) {
					if (i === pivotIndex) {
						// Skip the pivot element
						continue;
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

		if (filterDate !== '') {
			let innerWorking: ExpenseTable[] = [];
			for (let i = 0; i < working.length; i++) {
				const currentExpense = working[i];
				if (currentExpense.date === filterDate) {
					innerWorking = [...innerWorking, currentExpense];
				}
			}
			working = innerWorking;
		}

		if (filterType !== 'default') {
			let innerWorking: ExpenseTable[] = [];
			for (let i = 0; i < working.length; i++) {
				const currentExpense = working[i];
				if (currentExpense.type === filterType) {
					innerWorking = [...innerWorking, currentExpense];
				}
			}
			working = innerWorking;
		}

		if (filterChargeStatus === 'charge') {
			let innerWorking: ExpenseTable[] = [];
			for (let i = 0; i < working.length; i++) {
				const currentExpense = working[i];
				if (currentExpense.chargeToParents == true) {
					innerWorking = [...innerWorking, currentExpense];
				}
			}
			working = innerWorking;
		} else if (filterChargeStatus === 'no-charge') {
			let innerWorking: ExpenseTable[] = [];
			for (let i = 0; i < working.length; i++) {
				const currentExpense = working[i];
				if (currentExpense.chargeToParents == false) {
					innerWorking = [...innerWorking, currentExpense];
				}
			}
			working = innerWorking;
		}
		visibleExpenses = working;
	}

	let showFilters: boolean = true;
	function toggleShowFilters() {
		showFilters = !showFilters;
	}
</script>

<svelte:head>
	<title>View expenses</title>
</svelte:head>

{#if data.redirectFrom}
	<div out:fade>
		<SmallAlert
			style="success"
			body="The expense has been successfully {data.redirectFrom === 'delete-expense'
				? 'deleted'
				: 'updated'}"
			title="Success"
		/>
	</div>
{/if}

<h3 class="font-bold text-xl">View expenses</h3>
<div class="py-4">
	<button on:click={toggleShowFilters} class="opacity-50 text-sm">
		<i class="fa-solid fa-arrow-{showFilters ? 'up' : 'down'}" />
		{showFilters ? 'Hide' : 'Show'} filters and sorts
	</button>
</div>
{#if showFilters === true}
	<div class="flex flex-col gap-2">
		<div class="grid grid-cols-4 items-center gap-4">
			<Textbox placeholderText="DD/MM/YYYY" labelText="Date filter" bind:value={filterDate} />
			<Checkbox labelText="Sort by date" bind:isChecked={sortDate} />
			<Listbox bind:value={filterType} labelText="Expense type">
				<option value="Fuel">Fuel</option>
				<option value="Food">Food</option>
				<option value="Activity">Activity</option>
			</Listbox>
			<Listbox bind:value={filterChargeStatus} labelText="Charge to parents">
				<option value="charge">Charge to parents</option>
				<option value="no-charge">Do not charge to parents</option>
			</Listbox>
		</div>
		<Button on:click={updateFilters}>Update results</Button>
	</div>
{/if}
<div class="grid grid-cols-3 lg:grid-cols-6 p-2 rounded-xl text-sm opacity-50">
	<span>Date</span>
	<span>Name</span>
	<span>Cost</span>
	<span class="hidden lg:block">Type</span>
	<span class="hidden lg:block">Charge</span>
</div>

<div class="flex flex-col gap-2">
	{#each visibleExpenses as expense}
		<ExpenseSummary
			id={expense.expenseId}
			charge={expense.chargeToParents}
			cost={expense.cost}
			date={expense.date}
			name={expense.name}
			type={expense.type}
		/>
	{/each}
</div>
