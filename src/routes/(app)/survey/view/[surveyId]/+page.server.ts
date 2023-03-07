import { getExpandedSurvey, getExpandedSurveyWithResponses } from '$lib/util/expandedSurveyUtil';
import { getAdmin } from '$lib/util/newDb';
import type { expandedSurvey } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ params }: PageServerLoadEvent) => {
	if (params.surveyId !== undefined) {
		const expandedSurveyData: expandedSurvey | undefined = await getExpandedSurvey(params.surveyId);
		if (expandedSurveyData !== undefined) {
			const expandedSurveyDataWithResponses = await getExpandedSurveyWithResponses(params.surveyId);
			if (expandedSurveyDataWithResponses !== undefined) {
				const admin = getAdmin();
				const allParents = await admin.getParents();
				return {
					expandedSurveyDataWithResponses,
					parentData: allParents.map((parent) => parent.getData())
				};
			}
			throw error(500, 'exp survey data with responses undefined');
		}
		throw error(500, 'expanded survey undefined');
	}
	throw error(400, 'survey id slug not provided');
};
