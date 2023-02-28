import { getAccountId } from '$lib/util/cookies';
import { createSingleSession, getChild, getChildren, getParent } from '$lib/util/db';
import type { child, parent, session } from '$lib/util/types';
import { presenceCheck, validateDate, validateTime } from '$lib/util/validation';
import { error, invalid } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ cookies }: PageServerLoadEvent) => {
	const accountId = getAccountId(cookies);
	if (accountId !== undefined) {
		const parentData: parent | undefined = await getParent(accountId, 'account');
		if (parentData !== undefined) {
			const children: child[] | undefined = await getChildren(parentData.parentId);
			if (children !== undefined) {
				return { children };
			}
			throw error(400, 'children is undefned');
		}
		throw error(400, 'parent data not defined');
	}
	throw error(400, 'account id not defined');
};

export const actions: Actions = {
	default: async ({ request }: RequestEvent) => {
		const data = await request.formData();

		const childId = data.get('childId') as string;
		const startTime = data.get('startTime') as string;
		const date = data.get('date') as string;
		const length = Number(data.get('length') as string) * 60;

		if (presenceCheck(childId) === false) {
			return invalid(400, {
				message:
					'You must select a child to book the sesion for - please select a child from the drop down box',
				data: {
					childId,
					startTime,
					date,
					length
				}
			});
		} else if (validateTime(startTime) === false) {
			return invalid(400, {
				message:
					'The time that you have input is not valid - please ensure that the time specified follows the format HH:MM',
				data: {
					childId,
					startTime,
					date,
					length
				}
			});
		} else if (validateDate(date) === false) {
			return invalid(400, {
				message:
					'The date that you have input is not valid - please ensure that the date specified follows the format DD/MM/YYYY',
				data: {
					childId,
					startTime,
					date,
					length
				}
			});
		} else if (length < 1 || length > 570) {
			return invalid(400, {
				message:
					'The length of session that you have input is not valid - please ensure that between 0 and 9.5 hours',
				data: {
					childId,
					startTime,
					date,
					length
				}
			});
		}

		// should check that regulations are not broken here

		const createdSession: session = await createSingleSession(childId, date, startTime, length);

		const childData: child | undefined = await getChild(createdSession.childId);

		if (childData !== undefined) {
			return { success: true, createdSession, childData };
		}
		throw error(400, 'child data not defined');
	}
};
