import { getAdmin, Survey } from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin === true) {
		const admin = getAdmin();
		const surveys = await admin.getSurveys();
		if (surveys !== undefined) {
			return { surveys: surveys.map((survey) => new Survey(survey)) };
		}
		throw error(500, 'surveys undefined');
	}
	throw error(400, 'must be admin');
};
