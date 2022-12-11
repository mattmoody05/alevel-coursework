import { getAccountId } from '$lib/util/cookies';
import { createSingleSession, getChild, getChildren, getParent } from '$lib/util/db';
import type { child, parent, session } from '$lib/util/types';
import { error } from '@sveltejs/kit';
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

		// should check that regulations are not broken here

		const createdSession: session = await createSingleSession(childId, date, startTime, length);

		const childData: child | undefined = await getChild(createdSession.childId);

		if (childData !== undefined) {
			return { success: true, createdSession, childData };
		}
		throw error(400, 'child data not defined');
	}
};
