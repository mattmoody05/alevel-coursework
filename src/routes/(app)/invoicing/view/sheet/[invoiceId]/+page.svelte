<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let sessionTotal = 0;
	for (let i = 0; i < data.sessionData.length; i++) {
		const currentSession = data.sessionData[i];
		sessionTotal = sessionTotal + (currentSession.length / 60) * data.hourlyRate;
	}

	let expenseTotal = 0;
	for (let i = 0; i < data.expenseData.length; i++) {
		const currentExpense = data.expenseData[i];
		if (currentExpense.chargeToParents == true) {
			expenseTotal = expenseTotal + currentExpense.cost;
		}
	}
</script>

<h3 class="font-bold text-xl">Invoice sheet</h3>
<div class="flex justify-between">
	<div>
		<div>
			<span class="font-bold">Child's name: </span>{data.childData.firstName}
			{data.childData.lastName}
		</div>
		<div>
			<span class="font-bold">Invoice ID: </span>
			{data.invoiceData.invoiceId}
		</div>
		<div><span class="font-bold">Data generated:</span>{data.invoiceData.dateGenerated}</div>
		<div><span class="font-bold">Total payable: </span>£{data.invoiceData.total / 100}</div>
	</div>
	<div class="text-right">
		<span class="font-bold">Issued to:</span>
		<br />
		{data.parentData.firstName}
		{data.parentData.lastName}
		<br />
		Number {data.parentData.houseNumber}
		<br />
		{data.parentData.postcode}
		<br />
		{data.parentData.emailAddress}
	</div>
</div>

<h1 class="text-3xl pt-8"><span class="font-bold">Total: </span>£{data.invoiceData.total / 100}</h1>
<div class="py-4">
	<h4 class="font-bold text-lg">Basic hourly childminding</h4>
	<div class="pl-8">
		{#each data.sessionData as session}
			<div class="flex justify-between">
				<span>{session.date} - {session.length / 60} hours</span>
				<span>
					{session.length / 60} units @ £{data.hourlyRate / 100} = £{(session.length / 60) *
						(data.hourlyRate / 100)}
				</span>
			</div>
		{/each}
		<div class="text-right font-bold">Total: £{sessionTotal / 100}</div>
	</div>
</div>

{#if data.invoiceData.includeExpenses}
	<h4 class="font-bold text-lg">Expenses</h4>
	<div class="pl-8">
		{#each data.expenseData as expense}
			{#if expense.chargeToParents}
				<div class="flex justify-between">
					<span>{expense.date} - {expense.name}</span>
					<span>£{expense.cost / 100}</span>
				</div>
			{/if}
		{/each}
		<div class="text-right font-bold">Total: £{expenseTotal / 100}</div>
	</div>
{/if}
