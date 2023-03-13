<script lang="ts">
	import { Toggle } from '$lib/components/checkbox';
	import { Listbox } from '$lib/components/input';
	import type { PageData } from './$types';

	export let data: PageData;

	// Structure of a survey question option with responses included
	type optionWithResponses = {
		surveyQuestionOptionId: string;
		prompt: string;
		dateCreated: string;
		responses: {
			surveyResponseId: string;
			dateRecorded: string;
			parent: {
				parentId: string;
				firstName: string;
				lastName: string;
				phoneNumber: string;
				emailAddress: string;
				dateOfBirth: string;
				houseNumber: string;
				postcode: string;
				accountId: string;
			};
		}[];
	};

	// Structure of a survey question response with parentData included
	type adaptedResponse = {
		surveyResponseId: string;
		dateRecorded: string;
		parent: {
			parentId: string;
			firstName: string;
			lastName: string;
			phoneNumber: string;
			emailAddress: string;
			dateOfBirth: string;
			houseNumber: string;
			postcode: string;
			accountId: string;
		};
	};

	// Structure of a survey question with responses included
	type adaptedQuestion = {
		surveyQuestionId: string;
		prompt: string;
		dateCreated: string;
		options: optionWithResponses[];
		numberOfResponses: number;
	};

	let questions: adaptedQuestion[] = [];
	let viewByParent: boolean = false;
	let selectedParentId: string;
	const surveyData = data.expandedSurveyDataWithResponses;
	const parentData = data.parentData;

	// Creates an exapanded question array with all the necessary data
	// All extra data is related and used to help structure the interface
	for (let i = 0; i < surveyData.questions.length; i++) {
		const currentQuestion = surveyData.questions[i];

		// Creates the outline of a question from the page data
		let newQuestion: adaptedQuestion = {
			dateCreated: currentQuestion.dateCreated,
			prompt: currentQuestion.prompt,
			surveyQuestionId: currentQuestion.surveyQuestionId,
			options: [],
			numberOfResponses: 0
		};

		// Loops through all the options for a question
		for (let j = 0; j < currentQuestion.options.length; j++) {
			const option = currentQuestion.options[j];
			let responses: adaptedResponse[] = [];
			// Loops through all the responses to a question
			for (let k = 0; k < currentQuestion.responses.length; k++) {
				const currentResponse = currentQuestion.responses[k];
				if (
					currentResponse.surveyQuestionOption.surveyQuestionOptionId ===
					option.surveyQuestionOptionId
				) {
					// Finds the parent that created the current response
					const matchingParentData = parentData.filter(
						(parent) => parent.parentId === currentResponse.parentId
					)[0];

					// Adds a new response to the responses array with the parent's data included
					responses = [
						...responses,
						{
							surveyResponseId: currentResponse.surveyResponseId,
							dateRecorded: currentResponse.dateRecorded,
							parent: matchingParentData
						}
					];

					newQuestion.numberOfResponses = newQuestion.numberOfResponses + 1;
				}
			}

			// All of the responses to the current option have been looped through
			// The response data can now be added to the current question's option array
			newQuestion.options = [
				...newQuestion.options,
				{
					dateCreated: option.dateCreated,
					prompt: option.prompt,
					surveyQuestionOptionId: option.surveyQuestionOptionId,
					responses: responses
				}
			];
		}

		// All of the options for the current question have been looped through
		// The current question with all the added data can be added to the questions array
		questions = [...questions, newQuestion];
	}

	// Gets a list of the names of the parents who have responded a certain way to a question
	// Each name is seperated by a comma in the list
	function getParentList(option: optionWithResponses) {
		let parentList: string = '';
		for (let i = 0; i < option.responses.length; i++) {
			const response = option.responses[i];
			if (parentList === '') {
				parentList = `${response.parent.firstName} ${response.parent.lastName}`;
			} else {
				parentList = `${parentList}, ${response.parent.firstName} ${response.parent.lastName}`;
			}
		}
		return parentList;
	}
</script>

<div class="flex flex-col gap-2">
	<span class="opacity-50">
		Hover over number of responses to see list of parents who have voted this way
	</span>
	<Toggle
		leftLabelText="View by question"
		rightLabelText="View by parent"
		bind:isChecked={viewByParent}
	/>
	{#if viewByParent === true}
		<Listbox labelText="Select parent" bind:value={selectedParentId}>
			{#each data.parentData as parent}
				<option value={parent.parentId}>{parent.firstName} {parent.lastName}</option>
			{/each}
		</Listbox>
		{#if selectedParentId === 'default'}
			Please select a parent
		{:else}
			{#each questions as question}
				<div class="border bg-gray-100 border-gray-300 p-4 rounded-xl">
					<h3 class="font-bold text-xl">{question.prompt}</h3>
					<div class="flex flex-col gap-2 mt-2">
						{#each question.options as option}
							{#each option.responses as response}
								{#if response.parent.parentId === selectedParentId}
									{option.prompt}
								{/if}
							{/each}
						{/each}
					</div>
				</div>
			{/each}
		{/if}
	{:else}
		{#each questions as question}
			<div class="border bg-gray-100 border-gray-300 p-4 rounded-xl">
				<h3 class="font-bold text-xl">{question.prompt}</h3>
				<div class="flex flex-col gap-2 mt-2">
					{#each question.options as option}
						{@const parentList = getParentList(option)}
						{@const percentage = (option.responses.length / question.numberOfResponses) * 100}
						<div class="w-full grid grid-cols-2 items-center">
							<span class="font-bold">{option.prompt}</span>
							<div class="w-full border border-gray-300 rounded-lg overflow-hidden">
								<div
									class="px-3 py-2 font-bold {percentage < 10
										? 'bg-gray-100'
										: 'bg-gray-900 text-white'}"
									style="width: {String(percentage)}%;"
								>
									<span title={parentList}>{String(percentage)}%</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>
