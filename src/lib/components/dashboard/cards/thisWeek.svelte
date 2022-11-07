<script lang="ts">
	import type { sessionSummary } from '$lib/util/types';
	import { stringToColour } from '$lib/util/ui';
	import { CardWrapper } from '$lib/components/dashboard/cards';

	export let recentSessions: sessionSummary[];
	export let sessionsBooked: number;
	export let childrenBooked: number;
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
		<div class="flex flex-col gap-2 mt-1">
			{#each recentSessions as session}
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
</CardWrapper>
