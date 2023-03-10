<script lang="ts">
	import { CardWrapper } from '$lib/components/dashboard/cards';

	export let recentInvoices: { amountDue: number; dueDate: string }[];
	export let invoicesIssued: number;
	export let invoicesDue: number;

	// Used to format currency in the appropriate way
	const currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP'
	});
</script>

<CardWrapper title="Invoices">
	<div class="w-full grid grid-cols-2">
		<div class="flex flex-col">
			<span class="text-sm opacity-50">Invoices issued</span>
			<span class="text-4xl font-bold">{String(invoicesIssued)}</span>
		</div>
		<div class="flex flex-col">
			<span class="text-sm opacity-50">Invoices due</span>
			<span class="text-4xl font-bold">{String(invoicesDue)}</span>
		</div>
	</div>
	<div class="mt-4">
		<span>Recent invoices</span>
		<div class="flex flex-col gap-2 mt-1 opacity-50">
			{#each recentInvoices as invoice}
				<div class="grid grid-cols-2 text-sm items-center">
					<span>{currencyFormatter.format(invoice.amountDue / 100)}</span>
					<span>Due {invoice.dueDate}</span>
				</div>
			{/each}
		</div>
	</div>
</CardWrapper>
