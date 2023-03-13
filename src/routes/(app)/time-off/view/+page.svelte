<script lang="ts">
	import { TimeOffSummary } from '$lib/components/summaries';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>View time off periods</title>
</svelte:head>

<h3 class="font-bold text-xl">View time off periods</h3>
<div class="grid grid-cols-3 lg:grid-cols-4 text-sm opacity-50 my-2">
	<span>Start date</span>
	<span>End date</span>
	<span>Cancel sessions?</span>
</div>
<div class="flex flex-col gap-2">
	{#each data.timeOffPeriods as period}
		<TimeOffSummary
			timeOffPeriodId={period.timeOffPeriodId}
			startDate={period.startDate}
			endDate={period.endDate}
			cancelSessions={period.cancelSessions}
		/>
	{/each}
</div>
