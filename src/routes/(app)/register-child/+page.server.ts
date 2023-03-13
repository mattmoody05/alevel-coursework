import { getParent, getChild } from '$lib/util/db';
import { error, invalid, redirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';
import { openDb } from '../../../db/index';
import { v4 as uuidv4 } from 'uuid';
import { presenceCheck, validateDate } from '$lib/util/validation';

export const actions: Actions = {
	// Handles the form being submitted to register a child
	registerChild: async ({ request, locals }: RequestEvent) => {
		const account = locals.account;
		if (account !== undefined) {
			const parent = await getParent(account.accountId);

			// Extracts the data from the submitted HTML form
			const data = await request.formData();
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

				// Data is returned so that it can be used in the HTML template
				// Classes cannot be used in the template so the getData method is called to return JSON data
				return { success: true, childData: child?.getData() };
			} else {
				// The parent for the current account could not be found
				// 404: Not found code
				throw error(
					400,
					'We could not find a parent associated with the current user. Please ensure that you are not using an admin account. '
				);
			}
		} else {
			// No user is currently logged in
			// User is redirected to the login page
			// 308: Permanent redirect code
			throw redirect(308, '/login');
		}
	}
};
