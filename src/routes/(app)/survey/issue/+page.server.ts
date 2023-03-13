import { error, invalid } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { getAdmin, getSurvey, type ParentTable } from '$lib/util/db';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin === true) {
		const admin = getAdmin();
		const surveys = await admin.getSurveys();
		const parents = await admin.getParents();

		// Returns data so that it can be used in the HTML template
		// Classes cannot be used in the template so the getData method is called to return JSON data
		return {
			parentData: parents.map((parent) => parent.getData()),
			surveyData: surveys.map((survey) => survey.getData())
		};
	} else {
		// The user is not using an admin account
		// 403: Forbidden code
		throw error(
			403,
			'You must be an admin to issue surveys, please ensure that you are using an admin account. '
		);
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to issue a survey
	issue: async ({ request }) => {
		// Extracts the submitted data from the HTML form
		const data = await request.formData();
		const isAllParents = (data.get('allParents') as string) === 'on';
		const surveyId = data.get('surveyId') as string;

		const survey = await getSurvey(surveyId);
		if (survey !== undefined) {
			let parentIdToIssue: string[] = [];

			if (isAllParents === true) {
				// Gets the parentIds of all parents in the system
				const admin = getAdmin();
				const parents = await admin.getParents();
				parentIdToIssue = parents.map((parent) => parent.parentId);
			} else {
				// Fetches the parents that have been selected from the HTML form
				// Parses the stringified JSON data
				const selectedParents: ParentTable[] = JSON.parse(data.get('selectedParents') as string);

				if (selectedParents.length < 1) {
					return invalid(400, {
						message: 'You must select at least 1 parent to issue the survey to. '
					});
				}

				// Adds the parentId of each selected parent to the array
				parentIdToIssue = selectedParents.map((parent) => parent.parentId);
			}

			// Loops through the array and issues the survey to that parent
			for (let i = 0; i < parentIdToIssue.length; i++) {
				const currentParentId = parentIdToIssue[i];
				await survey.issue(currentParentId);
			}

			// Returns data so it can be used in the HTML template
			return { success: true };
		} else {
			// A survey could not be found in the database with the surveyId specified
			// 404: Not found code
			throw error(
				404,
				'The survey that you have specified cannot be found in the database, please ensure that you have selected a survey. '
			);
		}
	}
};
