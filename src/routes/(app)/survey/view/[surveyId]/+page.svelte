<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const surveyData = data.expandedSurveyDataWithResponses;
	const parentData = data.parentData;

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

	type adaptedQuestion = {
		surveyQuestionId: string;
		prompt: string;
		dateCreated: string;
		options: optionWithResponses[];
		numberOfResponses: number;
	};

	let questions: adaptedQuestion[] = [];

	for (let i = 0; i < surveyData.questions.length; i++) {
		const question = surveyData.questions[i];
		let newQuestion: adaptedQuestion = {
			dateCreated: question.dateCreated,
			prompt: question.prompt,
			surveyQuestionId: question.surveyQuestionId,
			options: [],
			numberOfResponses: 0
		};
		for (let j = 0; j < question.options.length; j++) {
			const option = question.options[j];
			let responses: adaptedResponse[] = [];
			for (let k = 0; k < question.responses.length; k++) {
				const response = question.responses[k];
				if (
					response.surveyQuestionOption.surveyQuestionOptionId === option.surveyQuestionOptionId
				) {
					const matchingParentData = parentData.filter(
						(parent) => parent.parentId === response.parentId
					);
					responses = [
						...responses,
						{
							surveyResponseId: response.surveyResponseId,
							dateRecorded: response.dateRecorded,
							parent: matchingParentData[0]
						}
					];
					newQuestion.numberOfResponses = newQuestion.numberOfResponses + 1;
				}
			}
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
		questions = [...questions, newQuestion];
	}

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
</div>
