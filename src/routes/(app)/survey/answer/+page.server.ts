import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { getSurveys } from '$lib/util/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin, account } = locals;
	if (!isAdmin) {
		if (account !== undefined) {
			if (account.parentId !== undefined) {
				const surveys = await getSurveys(account.parentId);
				if (surveys !== undefined) {
					return { surveys };
				}
				throw error(500, 'surveys undefined');
			}
			throw error(500, 'parent id undefined');
		}
		throw error(500, 'account undefined');
	}
	throw error(400, 'admin not access this page');
};
