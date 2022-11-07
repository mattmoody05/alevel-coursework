<script lang="ts">
	import { CardWrapper } from '$lib/components/dashboard/cards';
	import type { surveySummary } from '$lib/util/types';

	export let surveysIssued: number;
	export let surveysPending: number;
	export let recentSurveys: surveySummary[];
</script>

<CardWrapper title="Surveys and consent">
	<div class="w-full grid grid-cols-2">
		<div class="flex flex-col">
			<span class="text-sm opacity-50">Surveys issued</span>
			<span class="text-4xl font-bold">{String(surveysIssued)}</span>
		</div>
		<div class="flex flex-col">
			<span class="text-sm opacity-50">Surveys pending</span>
			<span class="text-4xl font-bold">{String(surveysPending)}</span>
		</div>
	</div>
	<div class="mt-4">
		<span>Recent surveys</span>
		<div class="flex flex-col gap-2 mt-1 opacity-50">
			{#each recentSurveys as survey}
				<div class="grid grid-cols-2 text-sm items-center">
					<span>{survey.surveyName}</span>
					<span class="">Due {survey.dueDate}</span>
				</div>
			{/each}
		</div>
	</div>
</CardWrapper>
