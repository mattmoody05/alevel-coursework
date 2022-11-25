<script lang="ts">
	import { FilterButton, SortButton } from '$lib/components/filters';
	import { TimeOffSummary } from '$lib/components/summaries';
</script>

<svelte:head>View time off periods</svelte:head>

<h3 class="font-bold text-xl">View time off periods</h3>
<div class="flex gap-2 my-2">
	<FilterButton />
	<SortButton />
</div>
<div class="grid grid-cols-3 lg:grid-cols-4 text-sm opacity-50 my-2">
	<span>Start date</span>
	<span>End date</span>
	<span>Cancel sessions?</span>
</div>
<div class="flex flex-col gap-2">
	<TimeOffSummary />
	<TimeOffSummary />
	<TimeOffSummary />
	<TimeOffSummary />
</div>
