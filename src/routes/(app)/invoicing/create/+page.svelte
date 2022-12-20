<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { LargeTextbox, Listbox, NumericUpDown } from '$lib/components/input';
	import { Textbox } from '$lib/components/input';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Create invoice</title>
</svelte:head>

<h3 class="font-bold text-xl">Create invoice</h3>
<form method="POST" class="flex flex-col gap-2 mt-2">
	<Listbox name="childId" labelText="Select child">
		{#each data.childrenSummary as child}
			<option value={child.childId}
				>{child.firstName} {child.lastName} ({child.parentFirstName} {child.parentLastName})</option
			>
		{/each}
	</Listbox>
	<Textbox name="startDate" labelText="Start date" placeholderText="DD/MM/YYYY" />
	<Textbox name="endDate" labelText="End date" placeholderText="DD/MM/YYYY" />
	<div class="grid grid-cols-3 gap-4">
		<div class="col-span-2">
			<Textbox
				name="additionalChargeName"
				labelText="Additional charge"
				placeholderText="Charge name"
			/>
		</div>
		<div class="flex flex-col justify-end">
			<!-- value "" used to show palceholder message -->
			<!-- use svelte-ignore? -->
			<NumericUpDown name="additionalChargeAmount" placeholderText="£" value="" />
		</div>
	</div>
	<div class="grid grid-cols-3 gap-4">
		<div class="col-span-2">
			<Textbox name="discountName" labelText="Discounts" placeholderText="Disount name" />
		</div>
		<div class="flex flex-col justify-end">
			<!-- value "" used to show palceholder message -->
			<!-- use svelte-ignore? -->
			<NumericUpDown name="discountAmount" placeholderText="%" value="" />
		</div>
	</div>
	<div class="py-2">
		<Checkbox name="includeExpenses" labelText="Include expenses" />
	</div>
	<h3 class="font-bold text-xl">Issue invoice</h3>
	<Listbox name="parentId" labelText="Select parent">
		{#each data.parents as parent}
			<option value={parent.parentId}>{parent.firstName} {parent.lastName}</option>
		{/each}
	</Listbox>
	<Textbox name="dateDue" labelText="Due date" placeholderText="DD/MM/YYYY" />
	<LargeTextbox name="invoiceMessage" labelText="Invoice message" />
	<Button style="submit">Create & issue invoice</Button>
</form>
