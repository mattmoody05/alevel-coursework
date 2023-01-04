<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { LargeTextbox, Textbox } from '$lib/components/input';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ActionData } from './$types';

	export let form: ActionData;

	type question = {
		questionNumber: number;
		answers: {
			answerNumber: number;
		}[];
	};

	const dummyQuestion: question = {
		questionNumber: 0,
		answers: [
			{
				answerNumber: 0
			},
			{
				answerNumber: 1
			}
		]
	};

	let questions: question[] = [dummyQuestion];

	function addQuestion() {
		questions = [
			...questions,
			{
				questionNumber: questions.length,
				answers: [
					{
						answerNumber: 0
					},
					{
						answerNumber: 1
					}
				]
			}
		];
	}

	function addAnswer(questionNumber: number) {
		questions[questionNumber].answers = [
			...questions[questionNumber].answers,
			{
				answerNumber: questions[questionNumber].answers.length
			}
		];
	}

	onMount(() => {
		setTimeout(() => {
			if (form !== undefined) {
				form.success = false;
			}
		}, 5000);
	});
</script>

<svelte:head>
	<title>Create survey</title>
</svelte:head>

{#if form?.success}
	<div out:fade>
		<SmallAlert style="success" body="The survey has been successfully created!" title="Success" />
	</div>
{/if}

<h3 class="font-bold text-xl">Create survey</h3>
<form class="grid lg:grid-cols-2 grid-cols-1 gap-8 pt-2" method="POST">
	<div class="flex flex-col gap-2" id="survey-details">
		<Textbox name="title" placeholderText="Title" labelText="Survey title" />
		<LargeTextbox name="description" labelText="Survey description" />
		<div class="py-2">
			<Checkbox name="consentForm" labelText="This survey is a consent form" />
		</div>
		<Checkbox name="anonymous" labelText="This survey is anonymous" />
	</div>
	<hr class="block lg:hidden" />
	<div class="flex flex-col gap-4" id="survey-questions">
		{#each questions as question, i}
			<div class="flex flex-col gap-2" id="question-{question.questionNumber + 1}">
				<Textbox
					name="question-{question.questionNumber}-prompt"
					labelText="Question {question.questionNumber + 1}"
					placeholderText="Prompt"
				/>
				{#each question.answers as answer}
					<Textbox
						name="question-{question.questionNumber}-answer-{answer.answerNumber}"
						placeholderText="Answer {answer.answerNumber + 1}"
					/>
				{/each}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span
					on:click={() => addAnswer(question.questionNumber)}
					class="underline opacity-50 text-center cursor-pointer"
				>
					Add answer
				</span>
			</div>
		{/each}
		<hr />
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<span on:click={addQuestion} class="underline opacity-50 text-center cursor-pointer">
			Add question
		</span>
		<Button style="submit">Create survey</Button>
	</div>
</form>
