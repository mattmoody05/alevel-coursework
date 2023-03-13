<script lang="ts">
	import { SurveySummary } from '$lib/components/summaries';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Answer surveys</title>
</svelte:head>

<h3 class="font-bold text-xl">Answer surveys</h3>
<div class="grid text-sm opacity-50 grid-cols-3 lg:grid-cols-5 my-2">
	<div>Status</div>
	<div>Name</div>
	<div>Consent form</div>
	<div class="hidden lg:block">Number of questions</div>
</div>
<div class="flex flex-col gap-2">
	{#each data.surveys as survey}
		<SurveySummary
			isConsentForm={survey.consentForm}
			numberOfQuestions={survey.numberOfQuestions}
			status="incomplete"
			surveyId={survey.surveyId}
			title={survey.title}
		/>
	{/each}
</div>
