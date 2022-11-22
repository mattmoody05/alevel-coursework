<script lang="ts">
	import { FilterButton, SortButton } from '$lib/components/filters';
	import { AbsenceSummary } from '$lib/components/summaries';

	type absenseReportSummary = {
		absenceId: string;
		childName: string;
		startDate: string;
		endDate: string;
		reason: string;
	};

	export let absenceReports: absenseReportSummary[] = [
		{
			absenceId: 'idHere',
			childName: 'Matthew',
			startDate: '10/11/22',
			endDate: '12/11/22',
			reason: 'COVID'
		},
		{
			absenceId: 'idHere',
			childName: 'Matthew',
			startDate: '10/11/22',
			endDate: '12/11/22',
			reason: 'COVID'
		}
	];
</script>

<svelte:head>
	<title>View absence reports</title>
</svelte:head>

<h3 class="font-bold text-xl">View absence reports</h3>
<div class="flex gap-2">
	<FilterButton />
	<SortButton />
</div>
<div class="grid grid-cols-3 lg:grid-cols-5 p-2 rounded-xl text-sm opacity-50">
	<span>Name</span>
	<span>Start date</span>
	<span>End date</span>
	<span class="hidden lg:block">Reason</span>
</div>

<div class="flex flex-col gap-2">
	{#each absenceReports as report}
		<AbsenceSummary {...report} />
	{/each}
</div>
