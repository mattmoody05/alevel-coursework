import { getParent, getChild } from '$lib/util/newDb';
import { error, invalid } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';
import { openDb } from '../../../db/index';
import { v4 as uuidv4 } from 'uuid';
import { presenceCheck, validateDate } from '$lib/util/validation';

export const actions: Actions = {
	// Handles the form being submitted to register a child
	registerChild: async ({ request, locals }: RequestEvent) => {
		const data = await request.formData();
		const account = locals.account;
		if (account !== undefined) {
			const parent = await getParent(account.accountId);

			const firstName = data.get('firstName') as string;
			const lastName = data.get('lastName') as string;
			const dateOfBirth = data.get('dateOfBirth') as string;
			const educationName = data.get('educationName') as string;
			const educationType = data.get('educationType') as string;
			const additionalNeedDetails = data.get('additionalNeedDetails') as string;
			const additionalNeedType = data.get('additionalNeedType') as string;

			if (presenceCheck(firstName) === false) {
				return invalid(400, {
					message: 'You must input a first name - this field cannot be left blank',
					data: {
						firstName,
						lastName,
						dateOfBirth,
						educationName,
						educationType,
						additionalNeedDetails,
						additionalNeedType
					}
				});
			} else if (presenceCheck(lastName) === false) {
				return invalid(400, {
					message: 'You must input a last name - this field cannot be left blank',
					data: {
						firstName,
						lastName,
						dateOfBirth,
						educationName,
						educationType,
						additionalNeedDetails,
						additionalNeedType
					}
				});
			} else if (validateDate(dateOfBirth) === false) {
				return invalid(400, {
					message:
						'You must input a valid date of birth - please make sure it follows the DD/MM/YYYY format',
					data: {
						firstName,
						lastName,
						dateOfBirth,
						educationName,
						educationType,
						additionalNeedDetails,
						additionalNeedType
					}
				});
			} else if (
				educationType !== 'none' &&
				educationType !== 'nursery' &&
				educationType !== 'primary-infant' &&
				educationType !== 'primary-junior'
			) {
				return invalid(400, {
					message:
						'You must specify a valid education type, please select a type from the drop down box',
					data: {
						firstName,
						lastName,
						dateOfBirth,
						educationName,
						educationType,
						additionalNeedDetails,
						additionalNeedType
					}
				});
			} else if (
				additionalNeedType !== 'none' &&
				additionalNeedType !== 'allergy' &&
				additionalNeedType !== 'health' &&
				additionalNeedType !== 'learning' &&
				additionalNeedType !== 'language' &&
				additionalNeedType !== 'disability'
			) {
				return invalid(400, {
					message:
						'You must specify a valid additional need type, please select a type from the drop down box',
					data: {
						firstName,
						lastName,
						dateOfBirth,
						educationName,
						educationType,
						additionalNeedDetails,
						additionalNeedType
					}
				});
			}

			if (parent !== undefined) {
				const db = await openDb();
				const childId: string = uuidv4();
				await db.run(
					'INSERT INTO child VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
					childId,
					firstName,
					lastName,
					dateOfBirth,
					educationName,
					educationType,
					additionalNeedDetails,
					additionalNeedType,
					parent.parentId
				);
				const child = await getChild(childId);
				return { success: true, childData: child?.getData() };
			}
			throw error(400, 'Parent not associated with that account');
		}
		throw error(400, 'Account undefined');
	}
};
