import {
	checkSurveyResponseExists,
	getExpandedSurvey,
	getExpandedSurveyQuestion,
	getSurveyResponse,
	updateSurveyResponse,
	writeSurveyResponse
} from '$lib/util/expandedSurveyUtil';
import type { expandedSurvey, expandedSurveyQuestion } from '$lib/util/types';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

async function getQuestionNumber(questionId: string) {
	const question: expandedSurveyQuestion | undefined = await getExpandedSurveyQuestion(questionId);
	if (question !== undefined) {
		const surveyData: expandedSurvey | undefined = await getExpandedSurvey(question.surveyId);
		if (surveyData !== undefined) {
			let questionNumber: number = 0;
			for (let index = 0; index < surveyData.questions.length; index++) {
				const currentQuestion = surveyData.questions[index];
				if (currentQuestion.surveyQuestionId === questionId) {
					questionNumber = index + 1;
				}
			}
			return questionNumber;
		}
		return undefined;
	}
	return undefined;
}

export const load: PageServerLoad = async ({ params, locals }: PageServerLoadEvent) => {
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

				let selectedOptionId = question.options[0].surveyQuestionOptionId;

				const { account } = locals;

				if (account !== undefined) {
					if (account.parentId !== undefined) {
						const responseAlreadyExists = await checkSurveyResponseExists(
							params.questionId,
							account.parentId
						);

						if (responseAlreadyExists) {
							const existingResponse = await getSurveyResponse(params.questionId, account.parentId);
							if (existingResponse !== undefined) {
								selectedOptionId = existingResponse.surveyQuestionOptionId;
							} else {
								throw error(500, 'existing response undefiend');
							}
						}

						return {
							question,
							questionNumber,
							nextQuestionId,
							previousQuestionId,
							surveyName,
							selectedOptionId
						};
					}
					throw error(400, 'parentId undefiend');
				}
				throw error(400, 'account undefiend');
			}
			throw error(500, 'question number undefiend');
		}
		throw error(500, 'survey data undefined');
	}
	throw error(500, 'question undefined');
};

export const actions: Actions = {
	nextQuestion: async ({ params, request, locals }: RequestEvent) => {
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
							await updateSurveyResponse(existingResponse?.surveyResponseId, selectedOptionId);
						} else {
							throw error(500, 'existing response not defined');
						}
					} else {
						await writeSurveyResponse(
							account.parentId,
							expandedSurveyData.surveyId,
							params.questionId,
							selectedOptionId
						);
					}

					const questionNumber = await getQuestionNumber(params.questionId);
					if (questionNumber !== undefined) {
						const nextQuestionId = expandedSurveyData.questions[questionNumber].surveyQuestionId;
						throw redirect(300, `/survey/answer/${params.surveyId}/${nextQuestionId}`);
					}
					throw error(500, 'question number undefiend');
				}
				throw error(500, 'expanded server data undefiend');
			}
			throw error(500, 'parentId not defined');
		}
		throw error(500, 'account undefiend');
	},
	previousQuestion: async ({ params, request, locals }: RequestEvent) => {
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
							await updateSurveyResponse(existingResponse.surveyResponseId, selectedOptionId);
						} else {
							throw error(500, 'existing response not defined');
						}
					} else {
						await writeSurveyResponse(
							account.parentId,
							expandedSurveyData.surveyId,
							params.questionId,
							selectedOptionId
						);
					}

					const questionNumber = await getQuestionNumber(params.questionId);
					if (questionNumber !== undefined) {
						const previousQuestionId =
							expandedSurveyData.questions[questionNumber - 2].surveyQuestionId;
						throw redirect(300, `/survey/answer/${params.surveyId}/${previousQuestionId}`);
					}
					throw error(500, 'question number undefiend');
				}
				throw error(500, 'expanded server data undefiend');
			}
			throw error(500, 'parentId not defined');
		}
		throw error(500, 'account undefiend');
	},
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
							await updateSurveyResponse(existingResponse.surveyResponseId, selectedOptionId);
						} else {
							throw error(500, 'existing response not defined');
						}
					} else {
						await writeSurveyResponse(
							account.parentId,
							expandedSurveyData.surveyId,
							params.questionId,
							selectedOptionId
						);
					}

					throw redirect(300, '/survey/answer');
				}
				throw error(500, 'expanded server data undefiend');
			}
			throw error(500, 'parentId not defined');
		}
		throw error(500, 'account undefiend');
	}
};
