import { getAdmin, getParent, Session } from '$lib/util/db';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { v4 as uuidv4 } from 'uuid';
import { presenceCheck, validateDate, validateTime } from '$lib/util/validation';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;

	if (isAdmin === true) {
		const admin = getAdmin();
		const children = await admin.getChildren();

		// Returns data so that it can be used in the HTML template
		// Classes cannot be used in the template so the getData method is called to return JSON data
		return { children: children.map((child) => child.getData()) };
	} else {
		if (account !== undefined) {
			const parent = await getParent(account.accountId);
			if (parent !== undefined) {
				const children = await parent.getChildren();

				// Returns data so that it can be used in the HTML template
				// Classes cannot be used in the template so the getData method is called to return JSON data
				return { children: children.map((child) => child.getData()) };
			} else {
				// No parent could be found for the currently logged in user
				// 404: Not found code
				throw error(
					404,
					'We could not find a parent associated with the current user. Please ensure that you are not using an admin account. '
				);
			}
		} else {
			// No user is currently logged in
			// User is redirected to the login page
			// 308: Permanent redirect code
			throw redirect(308, '/login');
		}
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to check availability
	checkAvailability: async ({ request }: RequestEvent) => {
		// Extracts the data submitted in the HTML form
		const data = await request.formData();
		const childId = data.get('childId') as string;
		const date = data.get('date') as string;
		const startTime = data.get('start-time') as string;
		const length = Number(data.get('length') as string) * 60;

		if (presenceCheck(childId) === false) {
			return invalid(400, {
				message:
					'You must select a child to book the sesion for - please select a child from the drop down box',
				data: {
					childId,
					startTime,
					date,
					length
				}
			});
		} else if (validateTime(startTime) === false) {
			return invalid(400, {
				message:
					'The time that you have input is not valid - please ensure that the time specified follows the format HH:MM',
				data: {
					childId,
					startTime,
					date,
					length
				}
			});
		} else if (validateDate(date) === false) {
			return invalid(400, {
				message:
					'The date that you have input is not valid - please ensure that the date specified follows the format DD/MM/YYYY',
				data: {
					childId,
					startTime,
					date,
					length
				}
			});
		} else if (length < 1 || length > 570) {
			return invalid(400, {
				message:
					'The length of session that you have input is not valid - please ensure that between 0 and 9.5 hours',
				data: {
					childId,
					startTime,
					date,
					length
				}
			});
		}

		const nowDate = new Date();

		const session = new Session({
			childId: childId,
			absenceCharge: false,
			absenceKeepSession: false,
			absent: false,
			date: date,
			dateBooked: nowDate.toLocaleDateString('en-GB'),
			isRecurring: false,
			length: length,
			sessionId: uuidv4(),
			startTime: startTime
		});

		// Checks the sessios's availability
		const availabilityChecker = session.getAvailabilityChecker();
		const okayChildcareLimits = await availabilityChecker.checkChildcareLimits();
		const okayTimeOff = await availabilityChecker.checkTimeOffPeriods();

		// Data is returned so that it can be used in the HTML template
		return { sessionAllowed: okayTimeOff && okayChildcareLimits };
	}
};
