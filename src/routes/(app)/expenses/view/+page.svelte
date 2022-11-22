<script lang="ts">
	import { FilterButton, SortButton } from '$lib/components/filters';
	import { ExpenseSummary } from '$lib/components/summaries';
</script>

<svelte:head>
	<title>View expenses</title>
</svelte:head>

<h3 class="font-bold text-xl">View expenses</h3>
<div class="flex gap-2">
	<FilterButton />
	<SortButton />
</div>
<div class="grid grid-cols-3 lg:grid-cols-6 p-2 rounded-xl text-sm opacity-50">
	<span>Date</span>
	<span>Name</span>
	<span>Cost</span>
	<span class="hidden lg:block">Type</span>
	<span class="hidden lg:block">Charge</span>
</div>

<div class="flex flex-col gap-2">
	<ExpenseSummary
		id="idHere"
		charge={false}
		cost={1199}
		date="10/11/22"
		name="ASDA shop"
		type="Food"
	/>
</div>
