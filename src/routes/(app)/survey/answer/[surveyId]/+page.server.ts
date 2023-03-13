import { getExpandedSurvey } from '$lib/util/expandedSurveyUtil';
import type { expandedSurvey } from '$lib/util/types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ params }: PageServerLoadEvent) => {
	if (params.surveyId !== undefined) {
		const expandedSurveyData: expandedSurvey | undefined = await getExpandedSurvey(params.surveyId);
		if (expandedSurveyData !== undefined) {
			// Gets the questionId for the first question in the survey
			const firstQuestionId = expandedSurveyData.questions[0].surveyQuestionId;

			// Redirect to the question answer page for the first question in the survey
			throw redirect(300, `/survey/answer/${params.surveyId}/${firstQuestionId}`);
		} else {
			// No survey with the specified surveyId could be found in the database
			// 404: Not found code
			throw error(
				404,
				'We could not find a survey with the surveyId specified. Please ensure that you have entered a valid surveyId.'
			);
		}
	} else {
		// No surveyId has been provided in the URL parameters
		// 400: Bad request code
		throw error(400, 'survey id slug not provided');
	}
};
