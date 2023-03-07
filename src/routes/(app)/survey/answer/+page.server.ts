import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { getParent } from '$lib/util/db';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin, account } = locals;
	if (isAdmin === false) {
		if (account !== undefined) {
			const parent = await getParent(account.accountId);
			if (parent !== undefined) {
				const surveys = await parent.getSurveys();
				return { surveys: surveys.map((survey) => survey.getData()) };
			}
			throw error(500, 'parent id undefined');
		}
		throw error(500, 'account undefined');
	}
	throw error(400, 'admin not access this page');
};
