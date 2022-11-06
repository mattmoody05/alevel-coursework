<script lang="ts">
	import type { sessionSummary } from '$lib/util/types';
	import { stringToColour } from '$lib/util/ui';
	import { CardWrapper } from '$lib/components/dashboard/cards';

	export let sessions: sessionSummary[] = [];
	export let sessionsBooked: number = 0;
	export let childrenBooked: number = 0;

	let test: string[] = ['Matthew', 'Oliver', 'Kabir', 'Jonathan'];
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
			{#each test as tes}
				<div class="grid grid-cols-3 text-sm items-center">
					<div class="{stringToColour(tes)} text-white rounded-lg px-2 py-1 max-w-max">{tes}</div>
					<span class="text-center">10/11/12</span>
					<span class="text-center">11:00</span>
				</div>
			{/each}
		</div>
	</div>
</CardWrapper>
