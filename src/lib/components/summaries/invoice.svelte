<script lang="ts">
	import { stringToColour } from '$lib/util/ui';

	export let invoiceId: string;
	export let childName: string;
	export let dateIssued: string;
	export let payable: number;
	export let dateDue: string;
	export let status: string;
</script>

<a href="/invoicing/view/{invoiceId}">
	<div class="bg-gray-100 border border-gray-300 p-2 grid grid-cols-3 lg:grid-cols-6 rounded-xl">
		<div class="px-2 py-1 {stringToColour('Matthew')} text-white rounded-lg max-w-max mr-2">
			{childName}
		</div>
		<div class="hidden lg:flex items-center">{dateIssued}</div>
		<div class="hidden lg:flex items-center">£{payable / 100}</div>
		<div class="flex items-center">{dateDue}</div>
		{#if status === 'Unpaid'}
			<div class="px-2 py-1 bg-red-500 text-white rounded-lg max-w-max">Unpaid</div>
		{:else if status === 'Paid'}
			<div class="px-2 py-1 bg-amber-500 text-white rounded-lg max-w-max">Paid</div>
		{:else if status === 'Confirmed paid'}
			<div class="px-2 py-1 bg-green-500 text-white rounded-lg max-w-max">Confirmed paid</div>
		{:else if status === 'Viewed'}
			<div class="px-2 py-1 bg-blue-500 text-white rounded-lg max-w-max">Viewed</div>
		{/if}

		<div class="hidden lg:flex justify-end">
			<a href="/invoicing/view/{invoiceId}">
				<div
					class="bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-700 py-1 px-2 min-w-max w-32 max-w-full flex items-center justify-center h-full"
				>
					View
				</div>
			</a>
		</div>
	</div>
</a>
