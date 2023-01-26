import { getAllExpenses } from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ locals, url }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin === true) {
		// Fetches all expenses from the database
		const expenses = await getAllExpenses();

		// Checks to see if the page has been redirected to from somewhere else in the system
		let redirectFrom;
		if (url.searchParams.has('redirect-from')) {
			// Gets the contents of the redirect-from query parameter
			redirectFrom = url.searchParams.get('redirect-from') as string;
		}

		// Data is returned so that it can be part of the HTML template
		return { expenses, redirectFrom };
	} else {
		// The current user is not an admin, they do not have the rights to view the data
		// 401: Forbidden code
		throw error(401, 'You must be an admin to view expense reports');
	}
};
