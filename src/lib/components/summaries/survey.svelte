<script lang="ts">
	export let surveyId: string;
	export let title: string;
	export let isConsentForm: boolean;
	export let numberOfQuestions: number;
	export let status: 'complete' | 'inProgress' | 'incomplete';
</script>

<a href="/survey/answer/{surveyId}">
	<div
		class="grid grid-cols-3 lg:grid-cols-5 p-2 bg-gray-100 border-gray-300 border rounded-xl items-center"
	>
		<div>
			{#if status === 'complete'}
				<div class="px-2 py-1 bg-green-400 text-white rounded-lg max-w-max mr-2">Complete</div>
			{:else if status === 'inProgress'}
				<div class="px-2 py-1 bg-amber-600 text-white rounded-lg max-w-max mr-2">In progress</div>
			{:else if status === 'incomplete'}
				<div class="px-2 py-1 bg-red-700 text-white rounded-lg max-w-max mr-2">Not started</div>
			{/if}
		</div>
		<div>{title}</div>
		<div>{isConsentForm ? 'Yes' : 'No'}</div>
		<div class="hidden lg:block">{String(numberOfQuestions)}</div>

		<div class="hidden lg:flex justify-end">
			<a href="/survey/answers/{surveyId}">
				<div
					class="bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-700 py-2 px-2 min-w-max w-32 max-w-full flex items-center justify-center h-full"
				>
					View
				</div>
			</a>
		</div>
	</div>
</a>
