import { getAdmin } from '$lib/util/db';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin } = locals;
	if (isAdmin === true) {
		const admin = getAdmin();
		const periods = await admin.getTimeOffPeriods();

		// Data is returned so it can be used in the HTML template
		// Classes cannot be used in the template so the getData method is used to return JSON data
		return { timeOffPeriods: periods.map((period) => period.getData()) };
	} else {
		// The current user is not an admin and they need to be to access this part of the system
		// 403: Forbidden code
		throw error(
			403,
			'You must be an admin to access this part of the system. Please ensure that you are using an admin account'
		);
	}
};
