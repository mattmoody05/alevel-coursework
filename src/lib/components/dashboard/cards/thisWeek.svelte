<script lang="ts">
	import { stringToColour } from '$lib/util/ui';
	import { CardWrapper } from '$lib/components/dashboard/cards';

	type sessionSummary = {
		childName: string;
		time: string;
		date: string;
	};

	export let recentSessions: sessionSummary[];
	export let sessionsBooked: number;
	export let childrenBooked: number;

	let visibleRecentSessions: sessionSummary[] = [];
	let sessionOverflowAmount: number = 0;

	// Finds the most recent 4 sessions in recentSessions array
	// Only these 4 sessions will be displayed
	// The amount not shown is calculated so it can be shown in the interface
	if (recentSessions.length > 4) {
		for (let i = recentSessions.length - 1; i >= recentSessions.length - 4; i--) {
			const currentSession = recentSessions[i];
			visibleRecentSessions = [...visibleRecentSessions, currentSession];
		}
		sessionOverflowAmount = recentSessions.length - visibleRecentSessions.length;
	} else {
		visibleRecentSessions = recentSessions;
	}
</script>

<CardWrapper title="This week">
	<div class="w-full grid grid-cols-2">
		<div class="flex flex-col">
			<span class="text-sm opacity-50">Sessions booked</span>
			<span class="text-4xl font-bold">{String(sessionsBooked)}</span>
		</div>
		<div class="flex flex-col">
			<span class="text-sm opacity-50">Children booked</span>
			<span class="text-4xl font-bold">{String(childrenBooked)}</span>
		</div>
	</div>
	<div class="mt-4">
		<span>Sessions</span>
		<div class="flex flex-col-reverse gap-2 mt-1">
			{#each visibleRecentSessions as session}
				<div class="grid grid-cols-3 text-sm items-center">
					<div
						class="{stringToColour(session.childName)} text-white rounded-lg px-2 py-1 max-w-max"
					>
						{session.childName}
					</div>
					<span class="opacity-50">{session.date}</span>
					<span class="opacity-50">{session.time}</span>
				</div>
			{/each}
		</div>
	</div>
	{#if sessionOverflowAmount > 0}
		<div class="w-full flex justify-center mt-4">
			<span class="opacity-50 text-sm">{sessionOverflowAmount} more hidden</span>
		</div>
	{/if}
</CardWrapper>
