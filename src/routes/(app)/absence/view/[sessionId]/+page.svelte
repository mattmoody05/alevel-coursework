<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// Will run when the page is rendered
	onMount(() => {
		// Hides the success alert after 5 seconds
		if (form?.success) {
			setTimeout(() => {
				form.success = false;
			}, 5000);
		}
	});
</script>

<svelte:head>
	<title>View absence report</title>
</svelte:head>

{#if form?.success}
	<div out:fade>
		<SmallAlert style="success" body="Absence has been successfully updated." title="Success" />
	</div>
{/if}

<h3 class="font-bold text-xl">View absence report</h3>

<div class="flex flex-col gap-4">
	<div class="grid lg:grid-cols-2 gap-4 mt-2">
		<div class="flex flex-col bg-gray-100 border-gray-300 border p-4 rounded-xl">
			<div>
				<span class="font-bold">Child:</span>
				{data.childData.firstName}
				{data.childData.lastName}
			</div>
			<div>
				<span class="font-bold">Date:</span>
				{data.sessionData.date}
			</div>
			<div>
				<span class="font-bold">Reason:</span>
				{data.sessionData.absenceReason}
			</div>
			<div>
				<span class="font-bold">Charge for session: </span>
				{data.sessionData.absenceCharge ? 'Yes' : 'No'}
			</div>
		</div>
		<div class="bg-gray-100 border-gray-300 border p-4 rounded-xl">
			<span class="font-bold">Additional information: </span>
			{data.sessionData.absenceAdditionalInformation}
		</div>
	</div>
	{#if data.isAdmin}
		<form action="?/updateReport" method="POST">
			<div class="flex flex-col gap-2 bg-gray-100 border-gray-300 border p-4 rounded-xl mb-4">
				<Checkbox
					bind:isChecked={data.sessionData.absenceCharge}
					name="chargeSessions"
					labelText="Charge sessions"
				/>
				<Checkbox
					bind:isChecked={data.sessionData.absenceKeepSession}
					name="keepSessions"
					labelText="Keep sessions"
				/>
			</div>
			<Button style="submit">Update</Button>
		</form>
	{/if}
</div>
