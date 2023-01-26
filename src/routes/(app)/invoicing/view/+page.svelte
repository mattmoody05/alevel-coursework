<script lang="ts">
	import { FilterButton, SortButton } from '$lib/components/filters';
	import { InvoiceSummary } from '$lib/components/summaries';
	import type { PageData } from './$types';
	import { getChildName } from '$lib/util/ui';

	export let data: PageData;
</script>

<svelte:head>
	<title>View invoices</title>
</svelte:head>

<h3 class="font-bold text-xl">View invoices</h3>
<div class="flex gap-2 my-2">
	<!-- <FilterButton />
	<SortButton /> -->
</div>
<div class="grid text-sm opacity-50 grid-cols-3 lg:grid-cols-6 my-2">
	<span>Child</span>
	<span class="hidden lg:block">Date issued</span>
	<span class="hidden lg:block">Payable</span>
	<span class="">Date due</span>
	<span>Payment status</span>
</div>
{#each data.invoices as invoice}
	<InvoiceSummary
		invoiceId={invoice.invoiceId}
		childName={getChildName(invoice.childId, data.children).firstName}
		dateDue={invoice.dateDue}
		dateIssued={invoice.dateIssued}
		payable={invoice.total}
		status={invoice.paymentStatus}
	/>
{/each}
