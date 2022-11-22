import { error } from '@sveltejs/kit';
import type { PageLoad, PageLoadEvent } from './$types';

export const load: PageLoad = ({ params }: PageLoadEvent) => {
	if (params.slug !== '') {
		return {
			sessionId: params.slug
		};
	}

	throw error(400);
};