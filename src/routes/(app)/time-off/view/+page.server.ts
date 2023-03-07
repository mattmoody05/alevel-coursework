import { getAdmin } from '$lib/util/db';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({}: PageServerLoadEvent) => {
	const admin = getAdmin();
	const periods = await admin.getTimeOffPeriods();
	return { timeOffPeriods: periods.map((period) => period.getData()) };
};
