<script lang="ts">
	import { FilterButton, SortButton } from '$lib/components/filters';
	import { AbsenceSummary } from '$lib/components/summaries';
	import type { PageData } from './$types';
	import { getChildName } from '$lib/util/ui';

	export let data: PageData;
</script>

<svelte:head>
	<title>View absence reports</title>
</svelte:head>

<h3 class="font-bold text-xl">View absence reports</h3>
<div class="flex gap-2">
	<!-- <FilterButton />
	<SortButton /> -->
</div>
<div class="grid grid-cols-3 lg:grid-cols-5 p-2 rounded-xl text-sm opacity-50">
	<span>Name</span>
	<span>Date</span>
	<span>Reason</span>
	<span class="hidden lg:block">Charge?</span>
</div>

<div class="flex flex-col gap-2">
	{#each data.absentSessions as absentSession}
		<AbsenceSummary
			sessionId={absentSession.sessionId}
			childName={getChildName(absentSession.childId, data.children).fullName}
			reason={absentSession.absenceReason}
			date={absentSession.date}
			absenceCharge={absentSession.absenceCharge}
		/>
	{/each}
</div>
