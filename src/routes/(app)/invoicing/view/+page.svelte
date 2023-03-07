<script lang="ts">
	import { InvoiceSummary } from '$lib/components/summaries';
	import type { PageData } from './$types';
	import { getChildName } from '$lib/util/ui';
	import { Listbox, Textbox } from '$lib/components/input';
	import { Checkbox } from '$lib/components/checkbox';
	import { Button } from '$lib/components/button';
	import type { InvoiceTable } from '$lib/util/db';
	import { getDateFromLocaleString } from '$lib/util/date';

	export let data: PageData;

	let filterDate: string = '';
	let sortDate: boolean = false;
	let filterChild: string = 'default';

	let visibleInvoices = data.invoices;

	function updateFilters() {
		// Working variable is the invoices that the filters are currently working with
		// Working is initially set to be all the invoices provided from the database
		// Each time a sort is selected, working will be what is left in the array after the sort

		// Innerworking starts with no elements in the array, and all matching elements within working array will be added to it
		// Innerworking is only necessary within filters, not sorts

		// At the end, visibleInvoices is set to working as it will be the result of all the filters that are active

		let working: InvoiceTable[] = data.invoices;
		if (sortDate === true) {
			function quickSort(arr: InvoiceTable[]): InvoiceTable[] {
				if (arr.length <= 1) {
					return arr; // Base case: an array of length 1 is already sorted
				}

				function getDateInt(invoice: InvoiceTable) {
					return getDateFromLocaleString(invoice.dateIssued).getTime();
				}

				// Choose a pivot element
				const pivotIndex = Math.floor(arr.length / 2);
				const pivot = arr[pivotIndex];

				// Partition the array around the pivot
				let less: InvoiceTable[] = [];
				let greater: InvoiceTable[] = [];
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

		if (filterDate !== '') {
			let innerWorking: InvoiceTable[] = [];
			for (let i = 0; i < working.length; i++) {
				const currentInvoice = working[i];
				if (currentInvoice.dateIssued === filterDate) {
					innerWorking = [...innerWorking, currentInvoice];
				}
			}
			working = innerWorking;
		}

		if (filterChild !== 'default') {
			let innerWorking: InvoiceTable[] = [];
			for (let i = 0; i < working.length; i++) {
				const currentInvoice = working[i];
				if (currentInvoice.childId === filterChild) {
					innerWorking = [...innerWorking, currentInvoice];
				}
			}
			working = innerWorking;
		}

		visibleInvoices = working;
	}

	let showFilters: boolean = true;
	function toggleShowFilters() {
		showFilters = !showFilters;
	}
</script>

<svelte:head>
	<title>View invoices</title>
</svelte:head>

<h3 class="font-bold text-xl">View invoices</h3>

<div class="py-4">
	<button on:click={toggleShowFilters} class="opacity-50 text-sm">
		<i class="fa-solid fa-arrow-{showFilters ? 'up' : 'down'}" />
		{showFilters ? 'Hide' : 'Show'} filters and sorts
	</button>
</div>
{#if showFilters === true}
	<div class="flex flex-col gap-2">
		<div class="grid grid-cols-3 items-center gap-4">
			<Textbox placeholderText="DD/MM/YYYY" labelText="Date filter" bind:value={filterDate} />
			<Checkbox labelText="Sort by date" bind:isChecked={sortDate} />
			<Listbox labelText="Child filter" bind:value={filterChild}>
				{#each data.children as child}
					<option value={child.childId}>{child.firstName}</option>
				{/each}
			</Listbox>
		</div>
		<Button on:click={updateFilters}>Update results</Button>
	</div>
{/if}

<div class="grid text-sm opacity-50 grid-cols-3 lg:grid-cols-6 my-2">
	<span>Child</span>
	<span class="hidden lg:block">Date issued</span>
	<span class="hidden lg:block">Payable</span>
	<span class="">Date due</span>
	<span>Status</span>
</div>
{#each visibleInvoices as invoice}
	<InvoiceSummary
		invoiceId={invoice.invoiceId}
		childName={getChildName(invoice.childId, data.children).firstName}
		dateDue={invoice.dateDue}
		dateIssued={invoice.dateIssued}
		payable={invoice.total}
		status={invoice.paymentStatus}
	/>
{/each}
