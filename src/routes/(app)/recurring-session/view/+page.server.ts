import { getChild, getChildren, getRecurringSessionRequest } from '$lib/util/db';
import type { child, recurringSessionRequest } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin, account } = locals;

	if (account !== undefined) {
		if (account.parentId !== undefined) {
			const children = await getChildren(account.parentId);
			if (children !== undefined) {
				let requests: recurringSessionRequest[] = [];
				for (let i = 0; i < children.length; i++) {
					const currentChild: child = children[i];
					const recurringSessionRequestData = await getRecurringSessionRequest(
						currentChild.childId
					);
					if (recurringSessionRequestData !== undefined) {
						requests = [...requests, recurringSessionRequestData];
					}
				}
				return { children, recurringSessionRequests: requests };
			}
			throw error(500, 'children undefined');
		}
		throw error(500, 'parent id undefined');
	}
	throw error(400, 'account undefined');
};

export const actions: Actions = {
	default: async ({}: RequestEvent) => {}
};
