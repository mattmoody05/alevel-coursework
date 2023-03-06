import { getAdmin, getParent, Session } from '$lib/util/newDb';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ locals, url }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;
	if (isAdmin === true) {
		const admin = getAdmin();
		const sessions = await admin.getSessions();
		const children = await admin.getChildren();
		const parents = await admin.getParents();

		let redirectFrom;
		if (url.searchParams.has('redirect-from')) {
			redirectFrom = url.searchParams.get('redirect-from') as string;
		}
		return {
			sessions: sessions.map((session) => session.getData()),
			children: children.map((child) => child.getData()),
			parents: parents.map((parent) => parent.getData()),
			redirectFrom
		};
	} else if (account !== undefined) {
		const parent = await getParent(account.accountId);
		if (parent !== undefined) {
			const children = await parent.getChildren();
			let sessions: Session[] = [];
			for (let i = 0; i < children.length; i++) {
				const currentChild = children[i];
				const currentChildSessions = await currentChild.getSessions();
				sessions = [...sessions, ...currentChildSessions];
			}
			let redirectFrom;
			if (url.searchParams.has('redirect-from')) {
				redirectFrom = url.searchParams.get('redirect-from') as string;
			}
			return {
				sessions: sessions.map((session) => session.getData()),
				children: children.map((child) => child.getData()),
				parents: [parent.getData()],
				redirectFrom
			};
		} else {
			// No parent was found in the database with a matching parentId
			// 500: Internal server error code
			throw error(
				500,
				'Could not get the data for the parent with the current accountId from the database. If an admin account is being used, please switch to a parent account.'
			);
		}
	} else {
		// No user is currently logged in
		// User is redirected to the login page
		// 308: Permanent redirect code
		throw redirect(308, '/login');
	}
};
