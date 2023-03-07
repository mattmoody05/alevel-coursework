import { HOURLY_RATE } from '$env/static/private';
import {
	Expense,
	getChild,
	getExpensesInPeriod,
	Invoice,
	Session,
	type InvoiceTable
} from './newDb';
import { v4 as uuidv4 } from 'uuid';

export async function generateInvoice(invoiceDetails: {
	childId: string;
	startDate: string;
	endDate: string;
	dateDue: string;
	includeExpenses: boolean;
	additionalChargeName?: string;
	additionalChargeAmount?: number;
	discountName?: string;
	discountAmount?: number;
	message?: string;
	parentId: string;
}): Promise<Invoice> {
	// Fetch all sessions in period

	let sessionsInPeriod: Session[] = [];
	const child = await getChild(invoiceDetails.childId);
	if (child !== undefined) {
		sessionsInPeriod = await child.getSessionsInPeriod(
			invoiceDetails.startDate,
			invoiceDetails.endDate
		);
	}

	// Fetch all expenses in period if they are being charged
	let expensesInPeriod: Expense[] = [];
	if (invoiceDetails.includeExpenses) {
		expensesInPeriod = await getExpensesInPeriod(invoiceDetails.startDate, invoiceDetails.endDate);
	}

	// Calc total
	let total = 0;

	for (let index = 0; index < sessionsInPeriod.length; index++) {
		const currentSession: Session = sessionsInPeriod[index];
		if (currentSession.absent) {
			if (currentSession.absenceCharge) {
				const sessionCost = (currentSession.length / 60) * Number(HOURLY_RATE);
				total = total + sessionCost;
			}
		} else {
			const sessionCost = (currentSession.length / 60) * Number(HOURLY_RATE);
			total = total + sessionCost;
		}
	}

	for (let index = 0; index < expensesInPeriod.length; index++) {
		const currentExpense: Expense = expensesInPeriod[index];
		if (currentExpense.chargeToParents) {
			total = total + currentExpense.cost;
		}
	}

	if (invoiceDetails.additionalChargeAmount !== undefined) {
		total = total + invoiceDetails.additionalChargeAmount;
	}

	if (invoiceDetails.discountAmount !== undefined) {
		total = total * ((100 - invoiceDetails.discountAmount) / 100);
	}

	const date = new Date();

	const generatedInvoice: InvoiceTable = {
		childId: invoiceDetails.childId,
		dateDue: invoiceDetails.dateDue,
		dateGenerated: date.toLocaleDateString('en-GB'),
		dateIssued: date.toLocaleDateString('en-GB'),
		endDate: invoiceDetails.endDate,
		startDate: invoiceDetails.startDate,
		includeExpenses: invoiceDetails.includeExpenses,
		invoiceId: uuidv4(),
		parentId: invoiceDetails.parentId,
		total: total,
		additionalChargeAmount: invoiceDetails.additionalChargeAmount,
		additionalChargeName: invoiceDetails.additionalChargeName,
		discountAmount: invoiceDetails.discountAmount,
		discountName: invoiceDetails.discountName,
		message: invoiceDetails.message,
		paymentStatus: 'Unpaid'
	};

	return new Invoice(generatedInvoice);
}
