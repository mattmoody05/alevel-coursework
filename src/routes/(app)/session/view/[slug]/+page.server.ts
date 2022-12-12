import { deleteSession, getChild, getSession, updateSession } from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import type { child, session } from '$lib/util/types';

export const load: PageServerLoad = async ({ params }: PageServerLoadEvent) => {
	if (params.slug !== '') {
		const sessionId = params.slug;
		const sessionData: session | undefined = await getSession(sessionId);
		if (sessionData !== undefined) {
			const childData: child | undefined = await getChild(sessionData.childId);
			if (childData !== undefined) {
				return { sessionData, childData };
			}
			throw error(400, 'child data is undefined');
		}
		throw error(400, 'session is undefined');
	}
	throw error(400, 'slug null');
};

export const actions: Actions = {
	updateSession: async ({ request, params }: RequestEvent) => {
		if (params.slug !== '') {
			const sessionId = params.slug;
			const data = await request.formData();

			const date = data.get('date') as string;
			const startTime = data.get('startTime') as string;
			const length = data.get('length') as string;

			const updatedSession = await updateSession(sessionId, startTime, date, Number(length));
			if (updatedSession !== undefined) {
				return { success: true, action: 'update' };
			}
			throw error(400, 'updated session undefined');
		}
		throw error(400, 'slug null');
	},
	cancelSession: async ({ params }: RequestEvent) => {
		if (params.slug !== '') {
			const sessionId = params.slug;
			await deleteSession(sessionId);
			return { success: true, action: 'cancel' };
		}
		throw error(400, 'slug null');
	}
};
