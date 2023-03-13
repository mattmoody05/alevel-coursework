import { createTimeOffPeriod } from '$lib/util/db';
import { validateDate } from '$lib/util/validation';
import { error, invalid } from '@sveltejs/kit';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { v4 as uuidv4 } from 'uuid';

export const load: PageServerLoad = async ({ locals }) => {
	const { isAdmin } = locals;
	if (isAdmin === true) {
		return {};
	} else {
		// The current user is not an admin
		// 403: Forbidden code
		throw error(
			403,
			'You must be an admin to book time off. Please use an admin account to access this feature.'
		);
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to book time off
	book: async ({ request }: RequestEvent) => {
		// Extracts the data submitted in the HTML form
		const data = await request.formData();
		const startDate = data.get('startDate') as string;
		const endDate = data.get('endDate') as string;
		const cancelSessions = data.get('cancelSessions') === 'on';

		if (validateDate(startDate) === false) {
			return invalid(400, {
				message:
					'The start date that you have input is not valid - please make sure it follows the DD/MM/YYYY format',
				data: {
					startDate,
					endDate,
					cancelSessions
				}
			});
		} else if (validateDate(endDate) === false) {
			return invalid(400, {
				message:
					'The end date that you have input is not valid - please make sure it follows the DD/MM/YYYY format',
				data: {
					startDate,
					endDate,
					cancelSessions
				}
			});
		}

		// Creates the time off period in the database
		const timeOffPeriodData = await createTimeOffPeriod({
			cancelSessions: cancelSessions,
			startDate: startDate,
			endDate: endDate,
			dateRecorded: new Date().toLocaleDateString('en-GB'),
			timeOffPeriodId: uuidv4()
		});

		// Sends a confirmation email to all parents about the time off period
		await timeOffPeriodData.timeOffPeriod.sendConfirmationEmail();

		// Returns data so it can be used in the HTML template
		// Classes cannot be used in the template, so the getData method is called to return JSON data
		return {
			success: true,
			cancelledSessions: timeOffPeriodData.cancelledSessions.map((session) => session.getData())
		};
	}
};
