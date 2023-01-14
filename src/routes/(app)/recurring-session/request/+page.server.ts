import {
	childHasRecurringSessionRequest,
	createRecurringSessionRequest,
	getChildren
} from '$lib/util/db';
import type { recurringSessionDayDetails } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { isAdmin, account } = locals;

	if (account !== undefined) {
		if (account.parentId !== undefined) {
			const children = await getChildren(account.parentId);
			if (children !== undefined) {
				return { children };
			}
			throw error(500, 'children undefined');
		}
		throw error(500, 'parent id not defined');
	}
	throw error(400, 'account not defined');
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const childId = data.get('childId') as string;

		const existingRequest = await childHasRecurringSessionRequest(childId);
		console.log(existingRequest);

		if (existingRequest === true) {
			throw error(400, 'selected child already has a recurring session request');
		}

		const recurringBasis = data.get('recurring-basis') as string;

		let dayDetails: recurringSessionDayDetails = {
			mondaySelected: false,
			tuesdaySelected: false,
			wednesdaySelected: false,
			thursdaySelected: false,
			fridaySelected: false
		};
		console.log('here');

		if (recurringBasis === 'daily') {
			const startTime = data.get('week-start-time') as string;
			const endTime = data.get('week-end-time') as string;

			dayDetails = {
				mondaySelected: true,
				mondayStartTime: startTime,
				mondayEndTime: endTime,
				tuesdaySelected: true,
				tuesdayStartTime: startTime,
				tuesdayEndTime: endTime,
				wednesdaySelected: true,
				wednesdayStartTime: startTime,
				wednesdayEndTime: endTime,
				thursdaySelected: true,
				thursdayStartTime: startTime,
				thursdayEndTime: endTime,
				fridaySelected: true,
				fridayStartTime: startTime,
				fridayEndTime: endTime
			};
		} else if (recurringBasis === 'weekly') {
			type days = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
			const dayList: days[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
			for (let i = 0; i < dayList.length; i++) {
				const currentDay = dayList[i];
				const isSelected = (data.get(`${currentDay}-selected`) as string) === 'on';
				dayDetails[`${currentDay}Selected`] = isSelected;
				const startTime = data.get(`${currentDay}-start-time`) as string;
				const endTime = data.get(`${currentDay}-end-time`) as string;
				if (startTime !== '') {
					dayDetails[`${currentDay}StartTime`] = startTime;
				}
				if (endTime !== '') {
					dayDetails[`${currentDay}EndTime`] = endTime;
				}
			}
		} else {
			throw error(400, 'must be daily or weekly recurring period');
		}

		await createRecurringSessionRequest(recurringBasis, dayDetails, childId);
		return { success: true };
	}
};
