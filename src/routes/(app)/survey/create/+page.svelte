<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { LargeTextbox, Textbox } from '$lib/components/input';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ActionData } from './$types';

	export let form: ActionData;

	// Will run when the page is rendered
	onMount(() => {
		// Hides the success alert after 5 seconds
		if (form?.success) {
			setTimeout(() => {
				form.success = false;
			}, 5000);
		}
		// Hides the validation error alert after 10 seconds
		if (form?.message !== undefined) {
			setTimeout(() => {
				form.message = undefined;
			}, 10000);
		}
	});

	// Structure of a question in the interface
	type question = {
		questionNumber: number;
		answers: {
			answerNumber: number;
		}[];
	};

	// The outline of a question that is reflected in the interface when a new question is added
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

	// The questions that are shown in the interface
	// Does not carry any question information except the question and answer numbers
	// Used to show the correct number of text boxes and keep track of numbering
	let questions: question[] = [dummyQuestion];

	// Adds a dummy question to the question array with the next question number
	// Will in turn create text boxes in the interface that can be used to input data
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

	// Adds a dummy answer to the specified question's answer array with the next answer number
	// Will in turn create text boxes in the interface that can be used to input data
	function addAnswer(questionNumber: number) {
		questions[questionNumber].answers = [
			...questions[questionNumber].answers,
			{
				answerNumber: questions[questionNumber].answers.length
			}
		];
	}
</script>

<svelte:head>
	<title>Create survey</title>
</svelte:head>

{#if form?.success}
	<div out:fade>
		<SmallAlert style="success" body="The survey has been successfully created!" title="Success" />
	</div>
{/if}

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

<h3 class="font-bold text-xl">Create survey</h3>
<form class="grid lg:grid-cols-2 grid-cols-1 gap-8 pt-2" method="POST" action="?/create">
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
		<!-- 
			As more itme are added to the question array, and the answer arrays within each question, more textboxes 
			will be shown in the interface for the user to input survey data into
		-->
		{#each questions as question}
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
				<!-- Prevent default modifier used so the form does not submit when button is pressed -->
				<button
					on:click|preventDefault={() => addAnswer(question.questionNumber)}
					class="underline opacity-50 text-center cursor-pointer"
				>
					Add answer
				</button>
			</div>
		{/each}
		<hr />
		<!-- Prevent default modifier used so the form does not submit when button is pressed -->
		<button
			on:click|preventDefault={addQuestion}
			class="underline opacity-50 text-center cursor-pointer"
		>
			Add question
		</button>
		<Button style="submit">Create survey</Button>
	</div>
</form>
