import { getAllParents, getExpandedSurvey, getExpandedSurveyWithResponses } from '$lib/util/db';
import type { expandedSurvey, expandedSurveyWithResponses } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ params }: PageServerLoadEvent) => {
	if (params.surveyId !== undefined) {
		const expandedSurveyData: expandedSurvey | undefined = await getExpandedSurvey(params.surveyId);
		if (expandedSurveyData !== undefined) {
			const expandedSurveyDataWithResponses = await getExpandedSurveyWithResponses(params.surveyId);
			if (expandedSurveyDataWithResponses !== undefined) {
				const allParents = await getAllParents();
				if (allParents !== undefined) {
					return { expandedSurveyDataWithResponses, parentData: allParents };
				}
				throw error(500, 'allparents undefined');
			}
			throw error(500, 'exp survey data with responses undefined');
		}
		throw error(500, 'expanded survey undefined');
	}
	throw error(400, 'survey id slug not provided');
};
