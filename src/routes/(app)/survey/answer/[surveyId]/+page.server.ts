import { getExpandedSurvey, getExpandedSurveyQuestion } from '$lib/util/expandedSurveyUtil';
import type { expandedSurvey } from '$lib/util/types';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ params }: PageServerLoadEvent) => {
	if (params.surveyId !== undefined) {
		const expandedSurveyData: expandedSurvey | undefined = await getExpandedSurvey(params.surveyId);
		if (expandedSurveyData !== undefined) {
			const firstQuestionId = expandedSurveyData.questions[0].surveyQuestionId;
			throw redirect(300, `/survey/answer/${params.surveyId}/${firstQuestionId}`);
		}
		throw error(500, 'expanded survey undefined');
	}
	throw error(400, 'survey id slug not provided');
};
