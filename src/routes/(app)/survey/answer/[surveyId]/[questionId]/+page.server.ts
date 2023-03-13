import {
	checkSurveyResponseExists,
	getExpandedSurvey,
	getExpandedSurveyQuestion,
	getQuestionNumber,
	getSurveyResponse,
	updateSurveyResponse,
	writeSurveyResponse
} from '$lib/util/expandedSurveyUtil';
import type { expandedSurvey, expandedSurveyQuestion } from '$lib/util/types';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ params, locals }: PageServerLoadEvent) => {
	const { account } = locals;

	const question: expandedSurveyQuestion | undefined = await getExpandedSurveyQuestion(
		params.questionId
	);
	if (question !== undefined) {
		const surveyData: expandedSurvey | undefined = await getExpandedSurvey(question.surveyId);
		if (surveyData !== undefined) {
			const questionNumber = await getQuestionNumber(params.questionId);
			if (questionNumber !== undefined) {
				const surveyName: string = surveyData.title;
				let previousQuestionId: string | undefined = undefined;
				let nextQuestionId: string | undefined = undefined;

				// Both: questionNumber is what is displayed in the interface, therefore it is 1 above the index in the array
				// Check that there is a previous question
				if (surveyData.questions[questionNumber - 2] !== undefined) {
					previousQuestionId = surveyData.questions[questionNumber - 2].surveyQuestionId;
				}
				// Check that there is a next question
				if (surveyData.questions[questionNumber] !== undefined) {
					nextQuestionId = surveyData.questions[questionNumber].surveyQuestionId;
				}

				// Initially sets the selected option to the first option of the question
				let selectedOptionId = question.options[0].surveyQuestionOptionId;

				if (account !== undefined) {
					if (account.parentId !== undefined) {
						const responseAlreadyExists = await checkSurveyResponseExists(
							params.questionId,
							account.parentId
						);

						if (responseAlreadyExists === true) {
							const existingResponse = await getSurveyResponse(params.questionId, account.parentId);
							if (existingResponse !== undefined) {
								// The user has previously submitted a response to the question
								// Sets the selected option to the response submitted previously
								selectedOptionId = existingResponse.surveyQuestionOptionId;
							} else {
								// A response already exists but could not be fetched from the database
								// 500: Internal server error code
								throw error(
									500,
									'There was an error fetching your existing survey response from the database. Please try again later. '
								);
							}
						}

						// Returns data so that it can be used in the HTML template
						return {
							question,
							questionNumber,
							nextQuestionId,
							previousQuestionId,
							surveyName,
							selectedOptionId
						};
					} else {
						// No parentId is associated with the account
						// 400: Bad request code
						throw error(
							400,
							'Could not get the data for the parent with the current accountId from the database. If an admin account is being used, please switch to a parent account.'
						);
					}
				} else {
					// No user is currently logged in
					// User is redirected to the login page
					// 308: Permanent redirect code
					throw redirect(308, '/login');
				}
			} else {
				// The question number could not be calculated
				// 500: Internal server error code
				throw error(
					500,
					'We were not able to calculate the question number of the current question, and therefore cannot render this page. Please try again later. '
				);
			}
		} else {
			// The survey that the question belongs to could not be found in the database
			// 404: Not found code
			throw error(
				404,
				'We could not find the survey that the current question belongs to. Please try again later. '
			);
		}
	} else {
		// No question with the questionId specified could be found in the database
		// 404: Not found code
		throw error(
			404,
			'We could not find a question with the questionId specified. Please ensure that you have entered a valid questionId.'
		);
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to progress to the next question
	nextQuestion: async ({ params, request, locals }: RequestEvent) => {
		const { account } = locals;
		if (account !== undefined) {
			if (account.parentId !== undefined) {
				const expandedSurveyData = await getExpandedSurvey(params.surveyId);
				if (expandedSurveyData !== undefined) {
					// Extracts the data from the submitted HTML form
					const data = await request.formData();
					const selectedOptionId = data.get('selectedOptionId') as string;

					const responseAlreadyExists = await checkSurveyResponseExists(
						params.questionId,
						account.parentId
					);

					if (responseAlreadyExists === true) {
						const existingResponse = await getSurveyResponse(params.questionId, account.parentId);
						if (existingResponse !== undefined) {
							// Updates the existing reponse to the question
							await updateSurveyResponse(existingResponse.surveyResponseId, selectedOptionId);
						} else {
							// A response already exists but could not be fetched from the database
							// 500: Internal server error code
							throw error(
								500,
								'There was an error fetching your existing survey response from the database. Please try again later. '
							);
						}
					} else {
						// Creates a new response to the question
						await writeSurveyResponse(
							account.parentId,
							expandedSurveyData.surveyId,
							params.questionId,
							selectedOptionId
						);
					}

					// Gets the question number of the current question
					const questionNumber = await getQuestionNumber(params.questionId);
					if (questionNumber !== undefined) {
						// Finds the questionId of the next question in the survey
						const nextQuestionId = expandedSurveyData.questions[questionNumber].surveyQuestionId;

						// Redirects to the question answer page for the next questionId
						throw redirect(300, `/survey/answer/${params.surveyId}/${nextQuestionId}`);
					} else {
						// The question number could not be calculated
						// 500: Internal server error code
						throw error(
							500,
							'We were not able to calculate the question number of the current question, and therefore cannot render this page. Please try again later. '
						);
					}
				} else {
					// The survey was not found in the database for that question
					// 404: Not found code
					throw error(
						404,
						'We could not find the survey related to the question that you are trying to view. Please try again later.'
					);
				}
			} else {
				// No parentId is associated with the account
				// 400: Bad request code
				throw error(
					400,
					'Could not get the data for the parent with the current accountId from the database. If an admin account is being used, please switch to a parent account.'
				);
			}
		} else {
			// No user is currently logged in
			// User is redirected to the login page
			// 308: Permanent redirect code
			throw redirect(308, '/login');
		}
	},

	// Handles the user submitting the form to go back to the previous question
	previousQuestion: async ({ params, request, locals }: RequestEvent) => {
		const { account } = locals;
		if (account !== undefined) {
			if (account.parentId !== undefined) {
				const expandedSurveyData = await getExpandedSurvey(params.surveyId);
				if (expandedSurveyData !== undefined) {
					// Extracts the data from the submitted HTML form
					const data = await request.formData();
					const selectedOptionId = data.get('selectedOptionId') as string;

					const responseAlreadyExists = await checkSurveyResponseExists(
						params.questionId,
						account.parentId
					);

					if (responseAlreadyExists === true) {
						const existingResponse = await getSurveyResponse(params.questionId, account.parentId);
						if (existingResponse !== undefined) {
							// Updates the existing response to the question
							await updateSurveyResponse(existingResponse.surveyResponseId, selectedOptionId);
						} else {
							// A response already exists but could not be fetched from the database
							// 500: Internal server error code
							throw error(
								500,
								'There was an error fetching your existing survey response from the database. Please try again later. '
							);
						}
					} else {
						// Writes a new response to the question
						await writeSurveyResponse(
							account.parentId,
							expandedSurveyData.surveyId,
							params.questionId,
							selectedOptionId
						);
					}

					const questionNumber = await getQuestionNumber(params.questionId);
					if (questionNumber !== undefined) {
						// Finds the questionId to the previous question in the survey
						const previousQuestionId =
							expandedSurveyData.questions[questionNumber - 2].surveyQuestionId;

						// Redirects to the question answer page for the previous questionId
						throw redirect(300, `/survey/answer/${params.surveyId}/${previousQuestionId}`);
					} else {
						// The question number could not be calculated
						// 500: Internal server error code
						throw error(
							500,
							'We were not able to calculate the question number of the current question, and therefore cannot render this page. Please try again later. '
						);
					}
				} else {
					// The survey was not found in the database for that question
					// 404: Not found code
					throw error(
						404,
						'We could not find the survey related to the question that you are trying to view. Please try again later.'
					);
				}
			} else {
				// No parentId is associated with the account
				// 400: Bad request code
				throw error(
					400,
					'Could not get the data for the parent with the current accountId from the database. If an admin account is being used, please switch to a parent account.'
				);
			}
		} else {
			// No user is currently logged in
			// User is redirected to the login page
			// 308: Permanent redirect code
			throw redirect(308, '/login');
		}
	},

	// Handles the user submitting the form to complete the survey
	finishSurvey: async ({ request, params, locals }: RequestEvent) => {
		const { account } = locals;
		if (account !== undefined) {
			if (account.parentId !== undefined) {
				const expandedSurveyData = await getExpandedSurvey(params.surveyId);
				if (expandedSurveyData !== undefined) {
					const data = await request.formData();
					const selectedOptionId = data.get('selectedOptionId') as string;

					const responseAlreadyExists = await checkSurveyResponseExists(
						params.questionId,
						account.parentId
					);
					if (responseAlreadyExists) {
						const existingResponse = await getSurveyResponse(params.questionId, account.parentId);
						if (existingResponse !== undefined) {
							// Updates the existing response to the question
							await updateSurveyResponse(existingResponse.surveyResponseId, selectedOptionId);
						} else {
							// A response already exists but could not be fetched from the database
							// 500: Internal server error code
							throw error(
								500,
								'There was an error fetching your existing survey response from the database. Please try again later. '
							);
						}
					} else {
						// Creates a new response to the question
						await writeSurveyResponse(
							account.parentId,
							expandedSurveyData.surveyId,
							params.questionId,
							selectedOptionId
						);
					}

					// Redirects back to the main survey answer page as the survey has been finished
					throw redirect(300, '/survey/answer');
				} else {
					// The survey was not found in the database for that question
					// 404: Not found code
					throw error(
						404,
						'We could not find the survey related to the question that you are trying to view. Please try again later.'
					);
				}
			} else {
				// No parentId is associated with the account
				// 400: Bad request code
				throw error(
					400,
					'Could not get the data for the parent with the current accountId from the database. If an admin account is being used, please switch to a parent account.'
				);
			}
		} else {
			// No user is currently logged in
			// User is redirected to the login page
			// 308: Permanent redirect code
			throw redirect(308, '/login');
		}
	}
};
