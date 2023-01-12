import type { PageServerLoad, PageServerLoadEvent } from './$types';
import type { child, session } from '$lib/util/types';
import { getAllChildren, getChildren, getParent, getSessionsWithAbsence } from '$lib/util/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ request, locals }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;
	if (isAdmin) {
		const children = await getAllChildren();
		if (children !== undefined) {
			let absentSessions: session[] = [];
			for (let i = 0; i < children.length; i++) {
				const currentChild: child = children[i];
				const sessionsWithAbsence = await getSessionsWithAbsence(currentChild.childId);
				if (sessionsWithAbsence !== undefined) {
					for (let j = 0; j < sessionsWithAbsence.length; j++) {
						const currentSessionWithAbsence = sessionsWithAbsence[j];
						absentSessions = [...absentSessions, currentSessionWithAbsence];
					}
				} else {
					throw error(500, 'sessions with absence undefined');
				}
			}
			return { absentSessions, children };
		}
		throw error(500, 'children undefined');
	} else {
		if (account !== undefined) {
			const parentData = await getParent(account.accountId, 'account');
			if (parentData !== undefined) {
				const children = await getChildren(parentData.parentId);
				if (children !== undefined) {
					let absentSessions: session[] = [];
					for (let i = 0; i < children.length; i++) {
						const currentChild: child = children[i];
						const sessionsWithAbsence = await getSessionsWithAbsence(currentChild.childId);
						if (sessionsWithAbsence !== undefined) {
							for (let j = 0; j < sessionsWithAbsence.length; j++) {
								const currentSessionWithAbsence = sessionsWithAbsence[j];
								absentSessions = [...absentSessions, currentSessionWithAbsence];
							}
						} else {
							throw error(500, 'sessions with absence undefined');
						}
					}
					return { absentSessions, children };
				}
				throw error(500, 'children undefined');
			}
			throw error(500, 'parent data undefined');
		}
		throw error(400, 'account undefined');
	}
};
