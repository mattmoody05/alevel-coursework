import { getSession } from '$lib/util/newDb';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ params }: PageServerLoadEvent) => {
	if (params.sessionId !== '') {
		const session = await getSession(params.sessionId);
		if (session !== undefined) {
			const child = await session.getChild();
			if (child !== undefined) {
				return { sessionData: session.getData(), childData: child.getData() };
			} else {
				throw error(
					404,
					'A child could not be found with the childId associated to the session that you are viewing'
				);
			}
		} else {
			throw error(
				404,
				'A session with the sessionId specified could not be found, please ensure that you enter a valid sessionId'
			);
		}
	} else {
		throw error(400, 'You have not specified a sessionId - to view a session you must specify one');
	}
};

export const actions: Actions = {
	// Handles the user submitting the form to update the session
	updateSession: async ({ request, params }: RequestEvent) => {
		if (params.sessionId !== '') {
			const session = await getSession(params.sessionId);

			const data = await request.formData();
			const date = data.get('date') as string;
			const startTime = data.get('startTime') as string;
			const length = Number(data.get('length') as string) * 60;

			if (session !== undefined) {
				await session.setDate(date);
				await session.setStartTime(startTime);
				await session.setLength(length);
				await session.sendEditEmail();
				throw redirect(302, '/session/view?redirect-from=update-session');
			} else {
				throw error(
					400,
					'A session with the sessionId specified could not be found - please ensure that you have entered a valid sessionId'
				);
			}
		} else {
			throw error(
				400,
				'You have not specified a sessionId - to view a session you must specify one'
			);
		}
	},
	// Handles the user submitting the form to cancel a session
	cancelSession: async ({ params }: RequestEvent) => {
		if (params.sessionId !== '') {
			const session = await getSession(params.sessionId);
			await session?.deleteFromDatabase();
			throw redirect(302, '/session/view?redirect-from=cancel-session');
		} else {
			throw error(
				400,
				'You have not specified a sessionId - to view a session you must specify one'
			);
		}
	}
};
