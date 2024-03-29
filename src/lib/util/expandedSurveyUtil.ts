import type { expandedSurvey, expandedSurveyQuestion, expandedSurveyWithResponses } from './types';
import { openDb } from '../../db/index';
import { v4 as uuidv4 } from 'uuid';
import {
	getSurvey,
	getSurveyQuestion,
	SurveyQuestion,
	type SurveyQuestionOptionTable,
	type SurveyResponseTable
} from './db';

// Gets a survey question and the options within
export async function getExpandedSurveyQuestion(
	surveyQuestionId: string
): Promise<expandedSurveyQuestion | undefined> {
	const surveyQuestionData = await getSurveyQuestion(surveyQuestionId);
	if (surveyQuestionData !== undefined) {
		const surveyQuestionOptions = await surveyQuestionData.getOptions();
		let expandedQuestion: expandedSurveyQuestion = {
			surveyId: surveyQuestionData.surveyId,
			dateCreated: surveyQuestionData.dateCreated,
			prompt: surveyQuestionData.prompt,
			surveyQuestionId: surveyQuestionData.surveyQuestionId,
			options: []
		};
		if (surveyQuestionOptions !== undefined) {
			surveyQuestionOptions.forEach((option) => {
				expandedQuestion.options.push({
					dateCreated: option.dateCreated,
					prompt: option.prompt,
					surveyQuestionOptionId: option.surveyQuestionOptionId
				});
			});
			return expandedQuestion;
		}
		return undefined;
	}
	return undefined;
}

// Gets a survey, the questions within and the options within
export async function getExpandedSurvey(surveyId: string): Promise<expandedSurvey | undefined> {
	const surveyData = await getSurvey(surveyId);
	if (surveyData !== undefined) {
		let expandedSurveyData: expandedSurvey = {
			anonymous: surveyData.anonymous,
			consentForm: surveyData.consentForm,
			dateCreated: surveyData.dateCreated,
			numberOfQuestions: surveyData.numberOfQuestions,
			questions: [],
			surveyId: surveyData.surveyId,
			title: surveyData.title,
			description: surveyData.description
		};
		const surveyQuestions: SurveyQuestion[] = await surveyData.getQuestions();
		if (surveyQuestions !== undefined) {
			for (let index = 0; index < surveyQuestions.length; index++) {
				const question = surveyQuestions[index];
				const expandedQuestion = await getExpandedSurveyQuestion(question.surveyQuestionId);
				if (expandedQuestion !== undefined) {
					expandedSurveyData.questions = [
						...expandedSurveyData.questions,
						{
							dateCreated: question.dateCreated,
							options: expandedQuestion.options,
							prompt: question.prompt,
							surveyQuestionId: question.surveyQuestionId
						}
					];
				}
			}
			return expandedSurveyData;
		}
		return undefined;
	}
	return undefined;
}

// Gets a surveyResponse for a parent
export async function getSurveyResponse(
	surveyQuestionId: string,
	parentId: string
): Promise<SurveyResponseTable | undefined> {
	const db = await openDb();
	const response: SurveyResponseTable | undefined = await db.get(
		'SELECT * FROM surveyResponse WHERE surveyQuestionId = ? AND parentId = ?',
		surveyQuestionId,
		parentId
	);
	return response;
}

// Writes a survey response for a parent
export async function writeSurveyResponse(
	parentId: string,
	surveyId: string,
	surveyQuestionId: string,
	surveyQuestionOptionId: string
): Promise<SurveyResponseTable> {
	const date = new Date();

	const surveyResponseData: SurveyResponseTable = {
		surveyResponseId: uuidv4(),
		dateRecorded: date.toLocaleDateString('en-GB'),
		parentId: parentId,
		surveyId: surveyId,
		surveyQuestionId: surveyQuestionId,
		surveyQuestionOptionId: surveyQuestionOptionId
	};

	const db = await openDb();

	await db.run(
		'INSERT INTO surveyResponse VALUES (?, ?, ?, ?, ?, ?)',
		surveyResponseData.surveyResponseId,
		surveyResponseData.dateRecorded,
		surveyResponseData.parentId,
		surveyResponseData.surveyId,
		surveyResponseData.surveyQuestionId,
		surveyResponseData.surveyQuestionOptionId
	);

	return surveyResponseData;
}

// Updates the survey response that a parent has previously submitted
export async function updateSurveyResponse(
	surveyResponseId: string,
	newSurveyQuestionOptionId: string
) {
	const db = await openDb();
	await db.run(
		'UPDATE surveyResponse SET surveyQuestionOptionId = ? WHERE surveyResponseId = ?',
		newSurveyQuestionOptionId,
		surveyResponseId
	);
}

// Checks whether or not a parent has submitted a response to a survey question previously
export async function checkSurveyResponseExists(surveyQuestionId: string, parentId: string) {
	const db = await openDb();
	const response = await db.get(
		'SELECT * FROM surveyResponse WHERE surveyQuestionId = ? AND parentId = ?',
		surveyQuestionId,
		parentId
	);
	if (response === undefined) {
		return false;
	}
	return true;
}

// Gets a survey, the questions within, the options within and the responses within
export async function getExpandedSurveyWithResponses(surveyId: string) {
	const db = await openDb();
	const expandedSurveyData: expandedSurvey | undefined = await getExpandedSurvey(surveyId);
	if (expandedSurveyData !== undefined) {
		let expandedSurveyDataWithResponses: expandedSurveyWithResponses = {
			anonymous: expandedSurveyData.anonymous,
			consentForm: expandedSurveyData.consentForm,
			dateCreated: expandedSurveyData.dateCreated,
			numberOfQuestions: expandedSurveyData.numberOfQuestions,
			surveyId: expandedSurveyData.surveyId,
			title: expandedSurveyData.surveyId,
			description: expandedSurveyData.description,
			questions: []
		};
		for (let i = 0; i < expandedSurveyData.questions.length; i++) {
			const currentQuestion = expandedSurveyData.questions[i];
			const currentQuestionResponses: SurveyResponseTable[] = await db.all(
				'SELECT * FROM surveyResponse WHERE surveyQuestionId = ?',
				currentQuestion.surveyQuestionId
			);
			let formattedResponses: {
				surveyResponseId: string;
				dateRecorded: string;
				parentId: string;
				surveyQuestionOption: {
					surveyQuestionOptionId: string;
					prompt: string;
					dateCreated: string;
				};
			}[] = [];
			if (currentQuestionResponses !== undefined) {
				for (let j = 0; j < currentQuestionResponses.length; j++) {
					const currentResponse = currentQuestionResponses[j];
					const optionData: SurveyQuestionOptionTable | undefined = await db.get(
						'SELECT * FROM surveyQuestionOption WHERE surveyQuestionOptionId = ?',
						currentResponse.surveyQuestionOptionId
					);
					if (optionData !== undefined) {
						formattedResponses = [
							...formattedResponses,
							{
								dateRecorded: currentResponse.dateRecorded,
								parentId: currentResponse.parentId,
								surveyResponseId: currentResponse.surveyResponseId,
								surveyQuestionOption: {
									dateCreated: optionData.dateCreated,
									prompt: optionData.prompt,
									surveyQuestionOptionId: optionData.surveyQuestionOptionId
								}
							}
						];
					}
				}
			}
			expandedSurveyDataWithResponses.questions = [
				...expandedSurveyDataWithResponses.questions,
				{
					dateCreated: currentQuestion.dateCreated,
					options: currentQuestion.options,
					prompt: currentQuestion.prompt,
					surveyQuestionId: currentQuestion.surveyQuestionId,
					responses: formattedResponses
				}
			];
		}
		return expandedSurveyDataWithResponses;
	}
	return undefined;
}

// Returns the question number of a question with the provided questionId
export async function getQuestionNumber(questionId: string) {
	const question: expandedSurveyQuestion | undefined = await getExpandedSurveyQuestion(questionId);
	if (question !== undefined) {
		const surveyData: expandedSurvey | undefined = await getExpandedSurvey(question.surveyId);
		if (surveyData !== undefined) {
			let questionNumber: number = 0;
			for (let i = 0; i < surveyData.questions.length; i++) {
				const currentQuestion = surveyData.questions[i];
				if (currentQuestion.surveyQuestionId === questionId) {
					questionNumber = i + 1;
				}
			}
			return questionNumber;
		}
		return undefined;
	}
	return undefined;
}
