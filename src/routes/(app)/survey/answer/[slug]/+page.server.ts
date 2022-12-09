import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = ({ params }: PageServerLoadEvent) => {
	if (params.slug !== '') {
		return {
			surveyId: params.slug
		};
	}

	throw error(400);
};
