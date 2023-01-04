import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { v4 as uuidv4 } from 'uuid';

import type { expandedSurvey, expandedSurveyQuestion } from '$lib/util/types';
import { writeSurvey } from '$lib/util/db';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin) {
		return;
	}
	throw error(400, 'Must be admin to create a survey');
};

export const actions: Actions = {
	default: async ({ request }: RequestEvent) => {
		const data = await request.formData();
		let formEntries: { key: string; data: string }[] = [];

		data.forEach((currentData, key) => {
			const dataString = currentData as string;
			formEntries.push({
				key: key,
				data: dataString
			});
		});

		const title = data.get('title') as string;
		const description = data.get('description') as string;
		const isConsentForm = (data.get('consentForm') as string) === 'on';
		const isAnonymous = (data.get('anonymous') as string) === 'on';

		const date = new Date();
		const currentDateString = date.toLocaleDateString('en-GB');

		const survey: expandedSurvey = {
			surveyId: uuidv4(),
			title: title,
			description: description,
			consentForm: isConsentForm,
			anonymous: isAnonymous,
			dateCreated: currentDateString,
			numberOfQuestions: 0,
			questions: []
		};

		let questions: expandedSurveyQuestion[] = [];

		formEntries.forEach((entry) => {
			if (entry.key.startsWith('question-')) {
				const splitKey = entry.key.split('-');
				const questionNumber = Number(splitKey[1]);

				const keyType = splitKey[2];
				if (keyType === 'prompt') {
					const questionPrompt = entry.data;
					survey.questions.push({
						surveyQuestionId: uuidv4(),
						dateCreated: survey.dateCreated,
						prompt: questionPrompt,
						options: []
					});
				} else if (keyType === 'answer') {
					const answerPrompt = entry.data;
					survey.questions[questionNumber].options.push({
						surveyQuestionOptionId: uuidv4(),
						dateCreated: survey.dateCreated,
						prompt: answerPrompt
					});
				}
			}
		});

		await writeSurvey(survey);

		return { success: true, surveyData: survey };
	}
};
