<script lang="ts">
	import { FilterButton, SortButton } from '$lib/components/filters';
	import { AbsenceSummary } from '$lib/components/summaries';
	import type { PageData } from './$types';

	export let data: PageData;

	type absentSessionSummary = {
		sessionId: string;
		childName: string;
		date: string;
		absenceCharge: boolean;
		reason?: string;
	};

	let absentSessions: absentSessionSummary[] = [];

	function getChildName(childId: string) {
		const children = data.children.filter((child) => child.childId === childId);
		return children[0];
	}

	for (let i = 0; i < data.absentSessions.length; i++) {
		const currentAbsentSession = data.absentSessions[i];
		absentSessions = [
			...absentSessions,
			{
				absenceCharge: currentAbsentSession.absenceCharge,
				childName: `${getChildName(currentAbsentSession.childId).firstName} ${
					getChildName(currentAbsentSession.childId).lastName
				}`,
				date: currentAbsentSession.date,
				sessionId: currentAbsentSession.sessionId,
				reason: currentAbsentSession.absenceReason
			}
		];
	}
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
	{#each absentSessions as absentSession}
		<AbsenceSummary
			childName={absentSession.childName}
			reason={absentSession.reason}
			sessionId={absentSession.sessionId}
			date={absentSession.date}
			absenceCharge={absentSession.absenceCharge}
		/>
	{/each}
</div>
