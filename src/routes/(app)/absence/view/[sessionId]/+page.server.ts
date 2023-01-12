import { getChild, getSession, updateAbsenceReport } from '$lib/util/db';
import type { child, session } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ params, locals }: PageServerLoadEvent) => {
	if (params.sessionId !== '') {
		const absentSession: session | undefined = await getSession(params.sessionId);
		if (absentSession !== undefined) {
			const childData: child | undefined = await getChild(absentSession.childId);
			if (childData !== undefined) {
				return { sessionData: absentSession, childData: childData };
			}
			throw error(500, 'child data undefined');
		}
		throw error(500, 'session data undefined');
	}
	throw error(400, 'session id not provided');
};

export const actions: Actions = {
	default: async ({ request, locals, params }: RequestEvent) => {
		const { isAdmin } = locals;

		if (isAdmin) {
			const data = await request.formData();

			const sessionId = params.sessionId;
			const keepSession: boolean = (data.get('keepSessions') as string) === 'on';
			const chargeSession: boolean = (data.get('chargeSessions') as string) === 'on';

			await updateAbsenceReport(sessionId, chargeSession, keepSession);

			return { success: true };
		}
		throw error(400, 'must be admin to update absence report');
	}
};
