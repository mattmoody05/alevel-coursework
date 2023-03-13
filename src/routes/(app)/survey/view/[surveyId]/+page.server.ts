import { getExpandedSurvey, getExpandedSurveyWithResponses } from '$lib/util/expandedSurveyUtil';
import { getAdmin } from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ params }: PageServerLoadEvent) => {
	if (params.surveyId !== undefined) {
		const expandedSurveyData = await getExpandedSurvey(params.surveyId);
		if (expandedSurveyData !== undefined) {
			const expandedSurveyDataWithResponses = await getExpandedSurveyWithResponses(params.surveyId);
			if (expandedSurveyDataWithResponses !== undefined) {
				const admin = getAdmin();
				const allParents = await admin.getParents();

				// Data is returned so it can be used in the HTML template
				// Classes cannot be used in the template, so the getData method is called to return JSON data
				return {
					expandedSurveyDataWithResponses,
					parentData: allParents.map((parent) => parent.getData())
				};
			} else {
				// The responses could not be found in the database, but the survey could
				// 500: Internal server error code
				throw error(500, 'exp survey data with responses undefined');
			}
		} else {
			// No survey with the surveyId specified could be found
			// 404: Not found code
			throw error(
				404,
				'We were not able to find a survey that matches the surveyId that has been specified. Please ensure that you have entered a valid surveyId.'
			);
		}
	} else {
		// No surveyId was specified in the URL params
		// 400: Bad request code
		throw error(
			400,
			'You have not provided a surveyId within the URL parameters. Please ensure that you have specified this. '
		);
	}
};
