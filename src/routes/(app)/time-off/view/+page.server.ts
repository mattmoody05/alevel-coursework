import { getTimeOffPeriods } from '$lib/util/db';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({}: PageServerLoadEvent) => {
	const periods = await getTimeOffPeriods();
	return { timeOffPeriods: periods };
};
