import { getAccountId } from '$lib/util/cookies';
import { getChildren, getChildSessions, getParent } from '$lib/util/db';
import type { child, session } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ cookies, url }: PageServerLoadEvent) => {
	const accountId = getAccountId(cookies);
	if (accountId !== undefined) {
		const parentData = await getParent(accountId, 'account');
		if (parentData !== undefined) {
			const children = await getChildren(parentData.parentId);
			if (children !== undefined) {
				let sessions: session[] = [];
				for (let i = 0; i < children.length; i++) {
					const currentChild: child = children[i];
					const currentChildSessions = await getChildSessions(currentChild.childId);
					if (currentChildSessions !== undefined) {
						for (let j = 0; j < currentChildSessions.length; j++) {
							const currentChildSession = currentChildSessions[j];
							sessions = [...sessions, currentChildSession];
						}
					} else {
						throw error(400, 'currentChildSessions is undefined');
					}
				}
				let redirectFrom;
				if (url.searchParams.has('redirect-from')) {
					redirectFrom = url.searchParams.get('redirect-from') as string;
				}
				return { sessions, children, redirectFrom };
			}
			throw error(400, 'children is undefined');
		}
		throw error(400, 'parent data not defined');
	}
	throw error(400, 'account id not defined');
};
