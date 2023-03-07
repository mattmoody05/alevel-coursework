import { error, invalid } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { getAdmin, getSurvey, type ParentTable } from '$lib/util/db';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin === true) {
		const admin = getAdmin();
		const surveys = await admin.getSurveys();
		const parents = await admin.getParents();
		return {
			parentData: parents.map((parent) => parent.getData()),
			surveyData: surveys.map((survey) => survey.getData())
		};
	} else {
		throw error(
			403,
			'You must be an admin to issue surveys, please ensure that you are using an admin account. '
		);
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to issue a survey
	issue: async ({ request }) => {
		const data = await request.formData();
		const isAllParents = (data.get('allParents') as string) === 'on';
		const surveyId = data.get('surveyId') as string;

		const survey = await getSurvey(surveyId);
		if (survey !== undefined) {
			let parentIdToIssue: string[] = [];

			if (isAllParents === true) {
				const admin = getAdmin();
				const parents = await admin.getParents();
				parentIdToIssue = parents.map((parent) => parent.parentId);
			} else {
				const selectedParents: ParentTable[] = JSON.parse(data.get('selectedParents') as string);
				if (selectedParents.length < 1) {
					return invalid(400, {
						message: 'You must select at least 1 parent to issue the survey to. '
					});
				}

				parentIdToIssue = selectedParents.map((parent) => parent.parentId);
			}

			for (let i = 0; i < parentIdToIssue.length; i++) {
				const currentParentId = parentIdToIssue[i];
				await survey.issue(currentParentId);
			}
			return { success: true };
		} else {
			throw error(
				404,
				'The survey that you have specified cannot be found in the database, please ensure that you have selected a survey. '
			);
		}
	}
};
