import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getParent } from '$lib/util/db';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin, account } = locals;
	if (isAdmin === false) {
		if (account !== undefined) {
			const parent = await getParent(account.accountId);
			if (parent !== undefined) {
				const surveys = await parent.getSurveys();

				// Data is returned so it can be used in the HTML template
				// Classes cannot be used in the template, so the getData method is called to return JSON data
				return { surveys: surveys.map((survey) => survey.getData()) };
			} else {
				// No parent was found in the database to be associated with the accuont
				// 404: Not found code
				throw error(
					404,
					'We could not find the parent associated with that account. Please ensure that you are not using an admin account. '
				);
			}
		} else {
			// No user is currently logged in
			// User is redirected to the login page
			// 308: Permanent redirect code
			throw redirect(308, '/login');
		}
	} else {
		// This is not a page that admins can access
		// 403: Forbidden code
		throw error(
			403,
			'Admins do not have access to submit answers to surveys. Please use a parent account to submit answers. '
		);
	}
};
