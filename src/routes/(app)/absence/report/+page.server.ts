import { getAccountId } from '$lib/util/cookies';
import { getChildren, getParent, createAbsenceReport } from '$lib/util/db';
import type { Actions, PageServerLoad, PageServerLoadEvent, RequestEvent } from './$types';
import type { parent, child } from '$lib/util/types';
import { error } from '@sveltejs/kit';

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
		const startDate = data.get('startDate') as string;
		const endDate = data.get('endDate') as string;
		const reason = data.get('reason') as string;
		const additionalInformation = data.get('additionalInformation') as string;

		const sessionsMarkedAsAbsent = await createAbsenceReport(
			childId,
			startDate,
			endDate,
			reason,
			additionalInformation
		);

		return { success: true, sessionsMarkedAsAbsent };
	}
};
