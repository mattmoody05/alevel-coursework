<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Listbox } from '$lib/components/input';
	import { stringToColour } from '$lib/util/ui';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	function getChildName(childId: string) {
		for (let i = 0; i < data.children.length; i++) {
			const currentChild = data.children[i];
			if (currentChild.childId === childId) {
				return currentChild.firstName;
			}
		}
		return '';
	}

	onMount(() => {
		if (form?.success) {
			setTimeout(() => {
				// @ts-ignore
				form.success = false;
			}, 5000);
		}
	});
</script>

<svelte:head>
	<title>View inoice</title>
</svelte:head>

{#if form?.success}
	<div out:fade>
		<SmallAlert
			style="success"
			body="Invoice payment status successfully updated"
			title="Success"
		/>
	</div>
{/if}

<h3 class="font-bold text-xl">View invoice</h3>
<div class="flex flex-col gap-2">
	<div class="flex gap-2 items-center">
		<span class="font-bold">Child name: </span>
		<div
			class="py-1 px-2 {stringToColour(
				getChildName(data.invoiceData.childId)
			)} rounded-lg text-white"
		>
			{getChildName(data.invoiceData.childId)}
		</div>
	</div>
	<div><span class="font-bold">Invoice ID: </span>{data.invoiceData.invoiceId}</div>
	<div><span class="font-bold">Date generated: </span>{data.invoiceData.dateGenerated}</div>
	<div><span class="font-bold">Total payable: </span> £{data.invoiceData.total / 100}</div>
	<div>
		<span class="font-bold">Invoice sheet: </span>
		<a class="underline" href="/invoicing/view/sheet/{data.invoiceData.invoiceId}"
			>Click here to view</a
		>
	</div>
	<div>
		<span class="font-bold">Invoice message: </span>{data.invoiceData.message}
	</div>
	<div />
	<form class="flex flex-col gap-2" method="POST">
		<Listbox
			name="paymentStatus"
			labelText="Payment status"
			bind:value={data.invoiceData.paymentStatus}
		>
			<option value="Unpaid">Unpaid</option>
			<option value="Paid">Paid</option>
			<option value="Confirmed paid">Confirmed paid</option>
		</Listbox>
		<Button style="submit">Update payment status</Button>
	</form>
</div>
