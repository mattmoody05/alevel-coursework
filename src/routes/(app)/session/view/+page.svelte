<script lang="ts">
	import { FilterButton, SortButton } from '$lib/components/filters';
	import { SessionSummary } from '$lib/components/summaries';
	import type { PageData } from './$types';

	export let data: PageData;

	function getChildName(childId: string) {
		const children = data.children.filter((child) => child.childId === childId);
		return children[0];
	}
</script>

<svelte:head>
	<title>View sessions</title>
</svelte:head>

<h3 class="font-bold text-xl">View sessions</h3>
<div class="flex gap-2">
	<FilterButton />
	<SortButton />
</div>
<div class="grid grid-cols-3 lg:grid-cols-5 p-2 rounded-xl text-sm opacity-50">
	<span>Name</span>
	<span>Date</span>
	<span class="hidden lg:block">Time</span>
	<span>Length</span>
</div>
<div class="flex flex-col gap-2">
	{#each data.sessions as session}
		<SessionSummary
			childName={getChildName(session.childId).firstName}
			date={session.date}
			length={session.length}
			sessionId={session.sessionId}
			time={session.startTime}
		/>
	{/each}
</div>
