// import { deleteTimeOffPeriod, getTimeOffPeriod } from '$lib/util/db';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import { getTimeOffPeriod } from '$lib/util/db';

export const load: PageServerLoad = async ({ params, request }: PageServerLoadEvent) => {
	const { timeOffPeriodId } = params;
	const period = await getTimeOffPeriod(timeOffPeriodId);
	if (period !== undefined) {
		return { timeOffPeriod: period.getData() };
	}
	throw error(500, 'period is undefined');
};

export const actions: Actions = {
	default: async ({ params }: RequestEvent) => {
		const { timeOffPeriodId } = params;
		const timeOffPeriod = await getTimeOffPeriod(timeOffPeriodId);
		if (timeOffPeriod !== undefined) {
			await timeOffPeriod.deleteFromDatabase();
			throw redirect(307, '/time-off/view');
		} else {
			throw error(404, 'time off period not found');
		}
	}
};
