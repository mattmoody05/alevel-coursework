import { getAllParents, getAllSurveys, issueSurvey } from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import type { parent } from '$lib/util/types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin) {
		const allSurveys = await getAllSurveys();
		if (allSurveys !== undefined) {
			const allParents = await getAllParents();
			if (allParents !== undefined) {
				return { parentData: allParents, surveyData: allSurveys };
			}
			throw error(500, 'all parents undefined');
		}
		throw error(500, 'all surveys undefined');
	}
	throw error(400, 'must be admin');
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const isAllParents = (data.get('allParents') as string) === 'on';
		const surveyId = data.get('surveyId') as string;
		if (isAllParents === true) {
			const allParents = await getAllParents();
			if (allParents !== undefined) {
				for (let i = 0; i < allParents.length; i++) {
					const currentParent = allParents[i];
					await issueSurvey(surveyId, currentParent.parentId);
				}
				return { success: true };
			}
			throw error(500, 'all parents undefined');
		} else {
			const selectedParents: parent[] = JSON.parse(data.get('selectedParents') as string);
			for (let i = 0; i < selectedParents.length; i++) {
				const currentParent = selectedParents[i];
				await issueSurvey(surveyId, currentParent.parentId);
			}
			return { success: true };
		}
	}
};
