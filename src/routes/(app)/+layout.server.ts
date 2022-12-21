import type { LayoutServerLoad, LayoutServerLoadEvent } from './$types';

export const load: LayoutServerLoad = ({ locals }: LayoutServerLoadEvent) => {
	const { isAdmin } = locals;
	return { isAdmin };
};
