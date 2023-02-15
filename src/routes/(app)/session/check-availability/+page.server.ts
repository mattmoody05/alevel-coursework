import { getAdmin, getParent, Session } from '$lib/util/newDb';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { v4 as uuidv4 } from 'uuid';

export const load: PageServerLoad = async ({ request, locals }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;

	if (isAdmin === true) {
		const admin = getAdmin();
		const children = await admin.getChildren();

		return { children: children.map((child) => child.getData()) };
	} else {
		if (account !== undefined) {
			const parent = await getParent(account.accountId);
			if (parent !== undefined) {
				const children = await parent.getChildren();
				return { children: children.map((child) => child.getData()) };
			} else {
				// parent not found
				throw error(400, 'oarebt not found');
			}
		} else {
			// not logged in
			throw error(400, 'not logged in');
		}
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to check availability
	checkAvailability: async ({ request }: RequestEvent) => {
		const data = await request.formData();
		const childId = data.get('childId') as string;
		const date = data.get('date') as string;
		const startTime = data.get('start-time') as string;
		const length = Number(data.get('length') as string) * 60;

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

		const availabilityChecker = session.getAvailabilityChecker();

		const okayChildcareLimits = await availabilityChecker.checkChildcareLimits();
		const okayTimeOff = await availabilityChecker.checkTimeOffPeriods();

		return { sessionAllowed: okayTimeOff && okayChildcareLimits };
	}
};
