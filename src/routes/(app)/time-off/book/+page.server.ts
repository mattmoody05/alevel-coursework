import { createTimeOffPeriod } from '$lib/util/db';
import { TimeOffPeriod } from '$lib/util/newDb';
import { validateDate } from '$lib/util/validation';
import { invalid } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';

export const actions: Actions = {
	default: async ({ request }: RequestEvent) => {
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

		const timeOffPeriodData = await createTimeOffPeriod(startDate, endDate, cancelSessions);
		const timeOffPeriod = new TimeOffPeriod(timeOffPeriodData.timeOffPeriodData);
		await timeOffPeriod.sendConfirmationEmail();

		return {
			success: true,
			cancelledSessions: timeOffPeriodData.cancelledSessions.map((session) => session.getData())
		};
	}
};
