import { getAllParents, getLatestTwoWayMessage, getParent } from '$lib/util/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import type { twoWayMessage } from '$lib/util/types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;
	if (isAdmin) {
		const parents = await getAllParents();
		if (parents !== undefined) {
			let latestMessages: { parentId: string; message: twoWayMessage }[] = [];
			for (let index = 0; index < parents.length; index++) {
				const currentParent = parents[index];
				const latestMessage = await getLatestTwoWayMessage(currentParent.parentId);
				if (latestMessage !== undefined) {
					latestMessages = [
						...latestMessages,
						{ parentId: currentParent.parentId, message: latestMessage }
					];
				} else {
					throw error(500, 'latest message undefined');
				}
			}
			return { isAdmin, parents, latestMessages };
		}
		throw error(500, 'parents undefined');
	} else {
		if (account !== undefined) {
			const parent = await getParent(account.accountId, 'account');
			if (parent !== undefined) {
				const latestMessage = await getLatestTwoWayMessage(parent.parentId);
				if (latestMessage !== undefined) {
					return { isAdmin, parent, latestMessage };
				}
				throw error(500, 'latest message undefined');
			}
			throw error(500, 'parent data not defiend');
		}
		throw error(400, 'account not defined');
	}
};
