import { getAllSurveys } from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({}: PageServerLoadEvent) => {
	const surveys = await getAllSurveys();
	if (surveys !== undefined) {
		return { surveys };
	}
	throw error(500, 'surveys undefined');
};
