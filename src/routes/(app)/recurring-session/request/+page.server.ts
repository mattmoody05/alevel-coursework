import { getChild, getParent } from '$lib/util/db';
import type { LowercaseDay, RecurringSessionDayDetails } from '$lib/util/types';
import { presenceCheck, validateTime } from '$lib/util/validation';
import { error, invalid, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { account } = locals;

	if (account !== undefined) {
		// Returns an instance of the parent class
		const parent = await getParent(account.accountId);
		if (parent !== undefined) {
			// Fetches the children belonging to the current parent from the databse
			const children = await parent.getChildren();

			// Returns data so that it can be used in the HTML template
			// Classes cannot be returned to the template so the getData method is called to return JSON data
			return {
				children: children.map((child) => child.getData())
			};
		} else {
			// No parent was returned from the database with the specified accountId
			// 404: Not found code
			throw error(
				404,
				'We could not find a parent associated with that account. Please make sure that you are not using an admin account. '
			);
		}
	} else {
		// No user is currently logged in
		// User is redirected to the login page
		// 308: Permanent redirect code
		throw redirect(308, '/login');
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to request a recurring session
	requestRecurringSession: async ({ request }) => {
		// Retrieves the data from the HTML form
		const data = await request.formData();
		const childId = data.get('childId') as string;
		const recurringBasis = data.get('recurring-basis') as string;

		if (presenceCheck(childId) === false || childId === 'default') {
			return invalid(400, {
				message:
					'You must specify a child to book a recurring session for - this field cannot be left blank',
				data: {
					childId,
					recurringBasis
				}
			});
		} else if (recurringBasis !== 'weekly' && recurringBasis !== 'daily') {
			return invalid(400, {
				message:
					'You must select either weekly or daily as your recurring basis - this field cannot be left blank',
				data: {
					childId,
					recurringBasis
				}
			});
		}

		// Returns an instance of the child class
		const child = await getChild(childId);

		if (child !== undefined) {
			// Check to see whether the child has previously request a recurring session
			const existingRequest = await child.hasRecurringSessionRequest();
			if (existingRequest === true) {
				// The child already has a recurring session
				// 400: Bad request code
				throw invalid(400, {
					message: `The child that you have selelcted to request a reecurring session for already has a request in the system. 
						Please remove the other recurring session before submitting a new one. `,
					data: {
						childId,
						recurringBasis
					}
				});
			}

			// Creates a dayDetails variable ready to be populated with the information input by the user
			let dayDetails: RecurringSessionDayDetails = {
				mondaySelected: false,
				tuesdaySelected: false,
				wednesdaySelected: false,
				thursdaySelected: false,
				fridaySelected: false
			};

			if (recurringBasis === 'daily') {
				// Retrieves the data from the HTML form
				const startTime = data.get('week-start-time') as string;
				const endTime = data.get('week-end-time') as string;

				if (validateTime(startTime) === false) {
					return invalid(400, {
						message:
							'You must specify a valid start time for the recurring sessions to start - please ensure that the time follows the HH:MM format',
						data: {
							childId,
							recurringBasis
						}
					});
				} else if (validateTime(endTime) === false) {
					return invalid(400, {
						message:
							'You must specify a valid end time for the recurring sessions to start - please ensure that the time follows the HH:MM format',
						data: {
							childId,
							recurringBasis
						}
					});
				}

				// Sets the day details according to the weekly start and end times specified in the form
				// Daily recurring basis so all start and end times are the same
				dayDetails = {
					mondaySelected: true,
					mondayStartTime: startTime,
					mondayEndTime: endTime,
					tuesdaySelected: true,
					tuesdayStartTime: startTime,
					tuesdayEndTime: endTime,
					wednesdaySelected: true,
					wednesdayStartTime: startTime,
					wednesdayEndTime: endTime,
					thursdaySelected: true,
					thursdayStartTime: startTime,
					thursdayEndTime: endTime,
					fridaySelected: true,
					fridayStartTime: startTime,
					fridayEndTime: endTime
				};

				if (validateTime(startTime) === false) {
					return invalid(400, {
						message:
							'You must specify a valid start time for the recurring sessions to start - please ensure that the time follows the HH:MM format',
						data: {
							childId,
							recurringBasis,
							dayDetails
						}
					});
				} else if (validateTime(endTime) === false) {
					return invalid(400, {
						message:
							'You must specify a valid end time for the recurring sessions to start - please ensure that the time follows the HH:MM format',
						data: {
							childId,
							recurringBasis,
							dayDetails
						}
					});
				}
			} else if (recurringBasis === 'weekly') {
				const dayList: LowercaseDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

				// Loops though each day of the week
				for (let i = 0; i < dayList.length; i++) {
					const currentDay = dayList[i];

					// Fetches data from the form for the current day
					// Casts string output from checkbox to boolean
					const isSelected = (data.get(`${currentDay}-selected`) as string) === 'on';
					const startTime = data.get(`${currentDay}-start-time`) as string;
					const endTime = data.get(`${currentDay}-end-time`) as string;

					// Sets the relevant parts of the dayDetails object to the data from the HTML form
					dayDetails[`${currentDay}Selected`] = isSelected;
					if (startTime !== '') {
						dayDetails[`${currentDay}StartTime`] = startTime;
					}
					if (endTime !== '') {
						dayDetails[`${currentDay}EndTime`] = endTime;
					}
				} // Loops though each day of the week
				for (let i = 0; i < dayList.length; i++) {
					const currentDay = dayList[i];

					// Fetches data from the form for the current day
					// Casts string output from checkbox to boolean
					const isSelected = (data.get(`${currentDay}-selected`) as string) === 'on';
					const startTime = data.get(`${currentDay}-start-time`) as string;
					const endTime = data.get(`${currentDay}-end-time`) as string;

					if (isSelected === true) {
						if (validateTime(startTime) === false) {
							return invalid(400, {
								message: `You must specify a valid start time (${currentDay}) for the recurring sessions to start - please ensure that the time follows the HH:MM format`,
								data: {
									childId,
									recurringBasis,
									dayDetails
								}
							});
						} else if (validateTime(endTime) === false) {
							return invalid(400, {
								message: `You must specify a valid end time (${currentDay}) for the recurring sessions to start - please ensure that the time follows the HH:MM format`,
								data: {
									childId,
									recurringBasis,
									dayDetails
								}
							});
						}
					}
				}
			} else {
				// The user has not specified a daily or weekly recurring basis
				// 400: Bad request code
				return invalid(400, {
					message: 'Please ensure that you have selected a recurring basis',
					data: {}
				});
			}

			// Creates the recurring session request in the database with the data input
			await child.createRecurringSessionRequest(recurringBasis, dayDetails);

			const recurringSessionRequest = await child.getRecurringSessionRequest();
			if (recurringSessionRequest !== undefined) {
				await recurringSessionRequest.sendConfirmationEmail('confirm-request');
			}

			// Returns data so that it can be used in the HTML template
			return { success: true };
		} else {
			// The child specified by the user was not found in the database
			// 404: Not found code
			throw error(
				404,
				'The child that you have specified could not be found in the database, please ensure that you have selected a child'
			);
		}
	}
};
