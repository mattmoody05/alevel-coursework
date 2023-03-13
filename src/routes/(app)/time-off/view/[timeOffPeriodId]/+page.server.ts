// import { deleteTimeOffPeriod, getTimeOffPeriod } from '$lib/util/db';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { getTimeOffPeriod } from '$lib/util/db';

export const load: PageServerLoad = async ({ params, request }: PageServerLoadEvent) => {
	const { timeOffPeriodId } = params;
	if (timeOffPeriodId !== '') {
		const period = await getTimeOffPeriod(timeOffPeriodId);
		if (period !== undefined) {
			return { timeOffPeriod: period.getData() };
		} else {
			// Time off period with the specified ID was not found in the database
			// 404: Not found code
			throw error(
				404,
				'A time off period with the specified timeOffPeriodId could not be found. Please ensure that you have entered a valid one.'
			);
		}
	} else {
		// There has not been a timeOffPeriodId specified in the URL params
		// 400: Bad request
		throw error(
			400,
			'You have not specified a timeOffPeriodId to view, please ensure that you have specified one in the URL parameters.'
		);
	}
};

export const actions: Actions = {
	// Handles the user submitting the HTML form to delete the time off period
	delete: async ({ params }: RequestEvent) => {
		const { timeOffPeriodId } = params;
		if (timeOffPeriodId !== '') {
			const timeOffPeriod = await getTimeOffPeriod(timeOffPeriodId);
			if (timeOffPeriod !== undefined) {
				await timeOffPeriod.deleteFromDatabase();

				// Redirects the user back to the main time off period view page
				throw redirect(307, '/time-off/view');
			} else {
				// Time off period with the specified ID was not found in the database
				// 404: Not found code
				throw error(
					404,
					'A time off period with the specified timeOffPeriodId could not be found. Please ensure that you have entered a valid one.'
				);
			}
		} else {
			// There has not been a timeOffPeriodId specified in the URL params
			// 400: Bad request
			throw error(
				400,
				'You have not specified a timeOffPeriodId to view, please ensure that you have specified one in the URL parameters.'
			);
		}
	}
};
