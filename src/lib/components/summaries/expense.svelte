<script lang="ts">
	export let id: string;
	export let date: string;
	export let name: string;
	export let cost: number;
	export let type: string;
	export let charge: boolean;

	// Used to format currency in the appropriate way
	const currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP'
	});
</script>

<a href="/expenses/view/{id}">
	<div class="grid grid-cols-3 lg:grid-cols-6 p-2 bg-gray-100 border-gray-300 border rounded-xl">
		<div class="flex items-center">{date}</div>
		<div class="flex items-center">{name}</div>
		<div class="flex items-center">{currencyFormatter.format(cost / 100)}</div>
		<div class="hidden lg:flex items-center">{type}</div>
		<div class="hidden lg:flex items-center">{charge ? 'Yes' : 'No'}</div>
		<div class="hidden lg:flex justify-end">
			<a href="/expenses/view/{id}">
				<div
					class="bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-700 p-2 min-w-max w-32 max-w-full flex items-center justify-center h-full"
				>
					View
				</div>
			</a>
		</div>
	</div>
</a>
