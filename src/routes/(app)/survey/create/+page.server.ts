import { error, invalid } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { v4 as uuidv4 } from 'uuid';
import { createSurvey } from '$lib/util/db';
import { presenceCheck } from '$lib/util/validation';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin === true) {
		return {};
	} else {
		// The current account is a parent account and they are not allowed to create surveys
		// 403: Forbidden code
		throw error(
			403,
			'Please use an admin account to create surveys, the parent account type does not have access to this feature'
		);
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to create a survey
	create: async ({ request }: RequestEvent) => {
		// Extracts the submitted data from the HTML form
		const data = await request.formData();
		const title = data.get('title') as string;
		const description = data.get('description') as string;
		const isConsentForm = (data.get('consentForm') as string) === 'on';
		const isAnonymous = (data.get('anonymous') as string) === 'on';

		// Each submitted input from the HTML form is looped through
		// Every key and value is added to the formEntries array so it can be used later to construct the survey
		// This is required rather than using the get method as there is an unknown number of questions and options
		let formEntries: { key: string; data: string }[] = [];
		data.forEach((currentData, key) => {
			const dataString = currentData as string;
			formEntries.push({
				key: key,
				data: dataString
			});
		});

		if (presenceCheck(title) === false) {
			return invalid(400, {
				message: 'You must input a survey title, this field cannot be left blank'
			});
		}

		// The survey with basic details is created in the database
		// No questions or question options have been added here
		// Returns a survey object so the relevant methods can be used to create surveys and options
		const newSurvey = await createSurvey({
			anonymous: isAnonymous,
			surveyId: uuidv4(),
			title: title,
			consentForm: isConsentForm,
			dateCreated: new Date().toLocaleDateString('en-GB'),
			description: description,
			numberOfQuestions: 0
		});

		// Loops through the formEntries array created earlier
		for (let i = 0; i < formEntries.length; i++) {
			const entry = formEntries[i];
			if (entry.key.startsWith('question-')) {
				// The current entry was part of a question

				// Splits the key using the delimeter "-"
				const splitKey = entry.key.split('-');

				// Gets the current question number (second entry in the array)
				const questionNumber = Number(splitKey[1]);

				const keyType = splitKey[2];
				if (keyType === 'prompt') {
					// The current entry was a question prompt
					// Adds the question prompt to the survey
					await newSurvey.addQuestion(entry.data);
				} else if (keyType === 'answer') {
					// The current entry is a question option
					const surveyQuestions = await newSurvey.getQuestions();

					// Adds the option to the question
					await surveyQuestions[questionNumber].addOption(entry.data);
				}
			}
		}

		// Data is returned so it can be used in the HTML template
		// Classes cannot be used in the template, so the getData method is called to return JSON data
		return { success: true, surveyData: newSurvey.getData() };
	}
};
