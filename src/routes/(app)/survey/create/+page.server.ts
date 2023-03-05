import { error, invalid } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { v4 as uuidv4 } from 'uuid';
import { createSurvey } from '$lib/util/newDb';
import { presenceCheck } from '$lib/util/validation';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin === true) {
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

		if (presenceCheck(title) === false) {
			return invalid(400, {
				message: 'You must input a survey title, this field cannot be left blank'
			});
		}

		const date = new Date();
		const currentDateString = date.toLocaleDateString('en-GB');

		// new code

		const newSurvey = await createSurvey({
			anonymous: isAnonymous,
			surveyId: uuidv4(),
			title: title,
			consentForm: isConsentForm,
			dateCreated: currentDateString,
			description: description,
			numberOfQuestions: 0
		});

		for (let i = 0; i < formEntries.length; i++) {
			const entry = formEntries[i];
			if (entry.key.startsWith('question-')) {
				const splitKey = entry.key.split('-');
				const questionNumber = Number(splitKey[1]);

				const keyType = splitKey[2];
				if (keyType === 'prompt') {
					const questionPrompt = entry.data;

					// very important that await is used here - the code below relies on the data already being in the database
					await newSurvey.addQuestion(questionPrompt);
				} else if (keyType === 'answer') {
					const answerPrompt = entry.data;
					const surveyQuestions = await newSurvey.getQuestions();

					surveyQuestions[questionNumber].addOption(answerPrompt);
				}
			}
		}

		return { success: true, surveyData: newSurvey.getData() };
	}
};
