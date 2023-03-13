<script lang="ts">
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import { Button } from '$lib/components/button';
	import type { PageData } from './$types';

	export let data: PageData;

	let selectedOptionId: string = data.selectedOptionId;

	// Will run after a navigation event has been triggered
	afterNavigate(() => {
		selectedOptionId = data.selectedOptionId;
	});
</script>

<svelte:head>
	<title>Answer survey</title>
</svelte:head>

<!-- use:enhance modifier is used to prevent page reload between questions -->
<form method="POST" class="flex flex-col justify-between h-full gap-2" use:enhance>
	<div class="header">
		<h3 class="font-bold text-xl">Answer survey</h3>
		<span class="font-bold">Survey name: </span>{data.surveyName}
	</div>

	<div
		class="main-question-content h-full w-full bg-gray-100 border border-gray-300 rounded-xl flex flex-col justify-between"
	>
		<div class="flex items-center justify-center h-full w-full">
			<p class="font-bold text-lg max-w-4xl">{data.question.prompt}</p>
		</div>
		<div class="flex-col flex gap-2 m-2">
			{#each data.question.options as questionOption}
				<!-- on:click events on div elements would usually cause accessibility issues, but in this case it is only used to make touch targets larger, not taking away functionality -->
				<!-- The radio buttons will still have full functionality without this on:click event -->

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					on:click={() => (selectedOptionId = questionOption.surveyQuestionOptionId)}
					class="{selectedOptionId === questionOption.surveyQuestionOptionId
						? 'bg-gray-900 text-white'
						: 'bg-gray-100 border border-gray-300'}  font-bold p-4 rounded-lg flex gap-2 items-center"
				>
					<input
						id={questionOption.surveyQuestionOptionId}
						name="selectedOptionId"
						type="radio"
						value={questionOption.surveyQuestionOptionId}
						bind:group={selectedOptionId}
					/>
					<label for={questionOption.surveyQuestionOptionId}>{questionOption.prompt}</label>
				</div>
			{/each}
		</div>
	</div>

	<div class="flex flex-col md:flex-row justify-between gap-2 items-center">
		<div class="min-w-max w-full md:w-40">
			<!-- Prev question button does not show if it is the first question in the survey -->
			{#if data.previousQuestionId !== undefined}
				<Button style="submit" formaction="?/previousQuestion">
					<div class="flex gap-2 items-center justify-center">
						<i class="fa-solid fa-arrow-left" /> <span>Previous</span>
					</div>
				</Button>
			{/if}
		</div>
		<div class="opacity-50 text-center w-full py-2">Question {data.questionNumber}</div>
		<div class="min-w-max w-full md:w-40">
			<!-- Next question button will not show if it is the final question in the survey -->
			<!-- Instead, a submit button is shown -->
			{#if data.nextQuestionId !== undefined}
				<Button style="submit" formaction="?/nextQuestion">
					<div class="flex gap-2 items-center justify-center">
						<span>Next</span> <i class="fa-solid fa-arrow-right" />
					</div>
				</Button>
			{:else}
				<Button style="submit" formaction="?/finishSurvey">
					<div class="flex gap-2 items-center justify-center">
						<i class="fa-solid fa-check" /> <span>Finish</span>
					</div>
				</Button>
			{/if}
		</div>
	</div>
</form>
