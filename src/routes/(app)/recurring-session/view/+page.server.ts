import {
	createRecurringSession,
	deleteRecurringSessionRequest,
	getAllChildren,
	getAllParents,
	getChild,
	getChildren,
	getRecurringSessionRequest,
	setRecurringSessionRequestStatus
} from '$lib/util/db';
import type { child, recurringSessionRequest } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin, account } = locals;
	let children: child[] | undefined = undefined;
	if (isAdmin) {
		children = await getAllChildren();
	} else {
		if (account !== undefined) {
			if (account.parentId !== undefined) {
				children = await getChildren(account.parentId);
			} else {
				throw error(500, 'parent id undefined');
			}
		} else {
			throw error(400, 'account undefined');
		}
	}
	if (children !== undefined) {
		let requests: recurringSessionRequest[] = [];
		for (let i = 0; i < children.length; i++) {
			const currentChild: child = children[i];
			const recurringSessionRequestData = await getRecurringSessionRequest(currentChild.childId);
			if (recurringSessionRequestData !== undefined) {
				requests = [...requests, recurringSessionRequestData];
			}
		}
		if (isAdmin) {
			const parents = await getAllParents();
			if (parents !== undefined) {
				return { children, recurringSessionRequests: requests, parents };
			}
			throw error(500, 'parents undefined');
		} else {
			return { children, recurringSessionRequests: requests };
		}
	}
	throw error(500, 'children undefined');
};

export const actions: Actions = {
	parentCancel: async ({ request }: RequestEvent) => {
		const data = await request.formData();

		const childId = data.get('childId') as string;

		await deleteRecurringSessionRequest(childId);
		return { success: true };
	},
	adminApprove: async ({ request, locals }: RequestEvent) => {
		const { isAdmin } = locals;
		if (isAdmin) {
			const data = await request.formData();
			const childId = data.get('childId') as string;
			await setRecurringSessionRequestStatus(childId, true);
			await createRecurringSession(childId);
			return { success: true };
		}
		throw error(400, 'must be admin');
	},
	adminDecline: async ({ request, locals }: RequestEvent) => {
		const { isAdmin } = locals;
		if (isAdmin) {
			const data = await request.formData();
			const childId = data.get('childId') as string;
			await setRecurringSessionRequestStatus(childId, false);
			return { success: true };
		}
		throw error(400, 'must be admin');
	}
};
