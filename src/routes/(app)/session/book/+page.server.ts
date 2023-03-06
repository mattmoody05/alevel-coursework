import { getAdmin, getParent, Session } from '$lib/util/newDb';
import { createSession } from '$lib/util/newDb';
import { presenceCheck, validateDate, validateTime } from '$lib/util/validation';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { v4 as uuidv4 } from 'uuid';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;
	if (isAdmin === true) {
		const admin = getAdmin();
		const children = await admin.getChildren();
		return { children: children.map((child) => child.getData()) };
	} else if (account !== undefined) {
		const parent = await getParent(account.accountId);
		if (parent !== undefined) {
			// Gets all the children for the currently logged in parent
			const children = await parent.getChildren();

			// Returns data so that it can be used in the HTML template
			return { children: children.map((child) => child.getData()) };
		} else {
			// No parent was found in the database with a matching parentId
			// 500: Internal server error code
			throw error(
				500,
				'Could not get the data for the parent with the current accountId from the database. If an admin account is being used, please switch to a parent account.'
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
	// Handles the user submitting the form to book a session
	book: async ({ request }: RequestEvent) => {
		const data = await request.formData();

		const childId = data.get('childId') as string;
		const startTime = data.get('startTime') as string;
		const date = data.get('date') as string;
		const length = Number(data.get('length') as string) * 60;
		const bypassRegs = (data.get('bypassRegs') as string) === 'on';

		if (presenceCheck(childId) === false) {
			return invalid(400, {
				message:
					'You must select a child to book the sesion for - please select a child from the drop down box',
				data: {
					childId,
					startTime,
					date,
					length: length / 60
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
					length: length / 60
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
					length: length / 60
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
					length: length / 60
				}
			});
		}

		const currentDate = new Date();

		const session = new Session({
			sessionId: uuidv4(),
			childId: childId,
			date: date,
			startTime: startTime,
			length: length,
			absenceCharge: false,
			absent: false,
			absenceKeepSession: true,
			dateBooked: currentDate.toLocaleDateString('en-GB'),
			isRecurring: false,
			invoiceId: undefined
		});

		const availabilityChecker = session.getAvailabilityChecker();

		const okayChildcareLimits = await availabilityChecker.checkChildcareLimits();
		const okayTimeOff = await availabilityChecker.checkTimeOffPeriods();

		const sessionAllowed = (okayTimeOff && okayChildcareLimits) || bypassRegs;

		if (sessionAllowed === true) {
			await createSession(session.getData());

			await session.sendConfirmationEmail();

			const child = await session.getChild();

			if (child !== undefined) {
				return { success: true, createdSession: session.getData(), childData: child.getData() };
			} else {
				throw error(
					400,
					'There was an error in fetching the child assoiated with the current session. No child with the specified childId was found. '
				);
			}
		} else {
			return invalid(400, {
				message:
					'Due to childcare regulations, your session is not able to be booked due to the business being at capacity.',
				data: {
					childId,
					startTime,
					date,
					length: length / 60
				}
			});
		}
	}
};
