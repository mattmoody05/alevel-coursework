import { getSession } from '$lib/util/db';
import { validateDate, validateTime } from '$lib/util/validation';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ params }: PageServerLoadEvent) => {
	if (params.sessionId !== '') {
		const session = await getSession(params.sessionId);
		if (session !== undefined) {
			const child = await session.getChild();
			if (child !== undefined) {
				// Data is returned so it can be used in the HTML template
				// Classes cannot be used in the template so JSON data is returned
				return { sessionData: session.getData(), childData: child.getData() };
			} else {
				// The child for the session could not be found
				// 404: Not found code
				throw error(
					404,
					'A child could not be found with the childId associated to the session that you are viewing'
				);
			}
		} else {
			// The session with the sessioId that is specified in the URL parameters could not be found
			// 404: Not found code
			throw error(
				404,
				'A session with the sessionId specified could not be found, please ensure that you enter a valid sessionId'
			);
		}
	} else {
		// There has not been a sessionId specified in the URL params
		// 400: Bad request code
		throw error(400, 'You have not specified a sessionId - to view a session you must specify one');
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to update the session
	updateSession: async ({ request, params }: RequestEvent) => {
		if (params.sessionId !== '') {
			const session = await getSession(params.sessionId);

			// Extracts the data submitted in the HTML form
			const data = await request.formData();
			const date = data.get('date') as string;
			const startTime = data.get('startTime') as string;
			const length = Number(data.get('length') as string) * 60;

			if (validateTime(startTime) === false) {
				return invalid(400, {
					message:
						'The time that you have input is not valid - please ensure that the time specified follows the format HH:MM',
					data: {
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
						startTime,
						date,
						length
					}
				});
			}

			if (session !== undefined) {
				await session.setDate(date);
				await session.setStartTime(startTime);
				await session.setLength(length);
				await session.sendEditEmail();

				// Redirects the user back to the main session view page
				// Includes a query parameter so the page can display the appropriate message
				throw redirect(302, '/session/view?redirect-from=update-session');
			} else {
				// No session with the specified sessionId could be found in the database
				// 404: Not found code
				throw error(
					404,
					'A session with the sessionId specified could not be found - please ensure that you have entered a valid sessionId'
				);
			}
		} else {
			// The user has not specified a session in the URL params
			// 400: Bad request code
			throw error(
				400,
				'You have not specified a sessionId - to view a session you must specify one'
			);
		}
	},
	// Handles the user submitting the form to cancel a session
	cancelSession: async ({ params }: RequestEvent) => {
		if (params.sessionId !== '') {
			const session = await getSession(params.sessionId);
			await session?.deleteFromDatabase();

			// Redirects the user back to the main session view page
			// Includes a query parameter so the page can display the appropriate message
			throw redirect(302, '/session/view?redirect-from=cancel-session');
		} else {
			// The user has not specified a session in the URL params
			// 400: Bad request code
			throw error(
				400,
				'You have not specified a sessionId - to view a session you must specify one'
			);
		}
	}
};
