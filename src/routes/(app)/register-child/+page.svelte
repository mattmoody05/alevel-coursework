<script lang="ts">
	import { Textbox, LargeTextbox, Listbox } from '$lib/components/input';
	import { Button, LinkButton } from '$lib/components/button';
	import type { ActionData } from './$types';
	import { stringToColour } from '$lib/util/ui';
	import { fade } from 'svelte/transition';
	import { SmallAlert } from '$lib/components/alert';
	import { onMount } from 'svelte';

	export let form: ActionData;

	// Will run when the page is rendered
	onMount(() => {
		// Hides validation error messages after 10 seconds
		if (form?.message !== undefined) {
			setTimeout(() => {
				form.message = undefined;
			}, 10000);
		}
	});
</script>

<svelte:head>
	<title>Register child</title>
</svelte:head>

{#if form?.success}
	<div class="h-full flex justify-center flex-col">
		<div class="m-8 flex flex-col gap-2">
			<h1 class="font-bold text-3xl">Child added!</h1>
			<p>
				<span class="py-1 px-2 {stringToColour(form.childData?.firstName)} rounded-lg text-white">
					{form.childData?.firstName}
				</span>
				<span class="opacity-50">
					has been added to your profile! Their name will always pop up in this colour so that you
					can always easily identify them!
					<br />
					Click the button below to be taken to the dashboard.
				</span>
			</p>
			<div class="min-w-max w-32 pt-2">
				<LinkButton style="primary" href="/">Dashboard</LinkButton>
			</div>
		</div>
	</div>
{:else}
	{#if form?.message !== undefined}
		<div transition:fade>
			<SmallAlert body={form?.message} title="Validation error" style="error" />
		</div>
	{/if}

	<h1 class="font-extrabold text-3xl">Register child</h1>
	<form action="?/registerChild" method="POST" class="grid grid-cols-1 lg:grid-cols-2 w-full gap-8">
		<div class="flex flex-col gap-2 mt-2">
			<h3 class="font-bold text-xl">Child details</h3>
			<Textbox labelText="First name" name="firstName" />
			<Textbox labelText="Last name" name="lastName" />
			<Textbox labelText="Date of birth" name="dateOfBirth" />
		</div>
		<div class="flex flex-col gap-2 mt-2">
			<h3 class="font-bold text-xl">Additional need details</h3>
			<Listbox labelText="Additional need type" name="additionalNeedType">
				<option value="none">None</option>
				<option value="allergy">Child has an allergy </option>
				<option value="health">Child has health issues</option>
				<option value="learning">Child has learning difficulties</option>
				<option value="language">Child has problems with language</option>
				<option value="disability">Child has a disability</option>
			</Listbox>
			<LargeTextbox labelText="Additional need details" name="additionalNeedDetails" />
		</div>
		<div class="flex flex-col gap-2 mt-2">
			<h3 class="font-bold text-xl">Education details</h3>
			<Listbox labelText="Education type" name="educationType">
				<option value="none">None</option>
				<option value="nursery">Nursery</option>
				<option value="primary-infant">Primary school (infants)</option>
				<option value="primary-junior">Primary school (juniors)</option>
			</Listbox>
			<Textbox labelText="Name of education" name="educationName" />
		</div>
		<div class="detail-section w-full flex flex-col justify-end gap-2" id="buttons">
			<Button style="submit">Submit</Button>
		</div>
	</form>
{/if}
