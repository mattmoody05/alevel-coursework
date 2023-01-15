import { createTimeOffPeriod } from '$lib/util/db';
import type { Actions, RequestEvent } from './$types';

export const actions: Actions = {
	default: async ({ request }: RequestEvent) => {
		const data = await request.formData();

		const startDate = data.get('startDate') as string;
		const endDate = data.get('endDate') as string;
		const cancelSessions = data.get('cancelSessions') === 'on';

		await createTimeOffPeriod(startDate, endDate, cancelSessions);

		return { success: true };
	}
};
