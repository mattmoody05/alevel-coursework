import { getAdmin, Survey } from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin === true) {
		const admin = getAdmin();
		const surveys = await admin.getSurveys();

		// Data is returned so it can be ussed in the HTML template
		// Classes cannot be used in the template so the getData method is called to return JSON data
		return { surveys: surveys.map((survey) => new Survey(survey)) };
	} else {
		// The current user is not an admin so cannot access this part of the system
		// 403: Forbidden code
		throw error(
			403,
			'You must be an admin to access this part of the system and the current account is not admin. '
		);
	}
};
