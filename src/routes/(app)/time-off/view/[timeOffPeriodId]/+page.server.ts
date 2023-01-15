import { deleteTimeOffPeriod, getTimeOffPeriod } from '$lib/util/db';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ params, request }: PageServerLoadEvent) => {
	const { timeOffPeriodId } = params;
	const period = await getTimeOffPeriod(timeOffPeriodId);
	if (period !== undefined) {
		return { timeOffPeriod: period };
	}
	throw error(500, 'period is undefined');
};

export const actions: Actions = {
	default: async ({ params }: RequestEvent) => {
		const { timeOffPeriodId } = params;
		await deleteTimeOffPeriod(timeOffPeriodId);
		throw redirect(307, '/time-off/view');
	}
};
