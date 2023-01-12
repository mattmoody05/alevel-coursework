<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { FilterButton, SortButton } from '$lib/components/filters';
	import { ExpenseSummary } from '$lib/components/summaries';
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
<div class="flex gap-2">
	<!-- <FilterButton />
	<SortButton /> -->
</div>
<div class="grid grid-cols-3 lg:grid-cols-6 p-2 rounded-xl text-sm opacity-50">
	<span>Date</span>
	<span>Name</span>
	<span>Cost</span>
	<span class="hidden lg:block">Type</span>
	<span class="hidden lg:block">Charge</span>
</div>

<div class="flex flex-col gap-2">
	{#each data.expenses as expense}
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
