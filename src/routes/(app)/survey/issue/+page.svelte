<script lang="ts">
	import { Listbox } from '$lib/components/input';
	import { stringToColour } from '$lib/util/ui';
	import type { ActionData, PageData } from './$types';
	import { Checkbox } from '$lib/components/checkbox';
	import { Button } from '$lib/components/button';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { SmallAlert } from '$lib/components/alert';
	import type { ParentTable } from '$lib/util/db';

	export let data: PageData;
	export let form: ActionData;

	let showParentSelectPopup: boolean = false;
	let addedParentList: ParentTable[] = [];
	let allParentsChecked: boolean = true;

	// Reactive variable - anytime the addedParentList array changes, this one will be recalculated
	$: addedParentListFormEntry = JSON.stringify(addedParentList);

	// Will run when the page is rendered
	onMount(() => {
		// Hides the success alert after 5 seconds
		if (form?.success) {
			setTimeout(() => {
				form.success = false;
			}, 5000);
		}
		// Hides the validation error alert after 10 seconds
		if (form?.message !== undefined) {
			setTimeout(() => {
				form.message = undefined;
			}, 10000);
		}
	});

	function showParentPopup() {
		showParentSelectPopup = true;
	}

	function hideParentPopup() {
		showParentSelectPopup = false;
	}

	// Removes a the parent with the specified parentId from the added parent array
	function removeParent(parentId: string) {
		let newList: ParentTable[] = [];
		for (let i = 0; i < addedParentList.length; i++) {
			const currentParent = addedParentList[i];
			if (currentParent.parentId !== parentId) {
				newList = [...newList, currentParent];
			}
		}
		addedParentList = newList;
	}

	// Adds a parent to the added parent array
	function addParent(parent: ParentTable) {
		addedParentList = [...addedParentList, parent];
	}
</script>

{#if form?.success}
	<div out:fade>
		<SmallAlert style="success" body="Survey has been issued successfully" title="Success" />
	</div>
{/if}

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

<h3 class="font-bold text-xl">Issue survey</h3>
<form action="?/issue" method="POST" class="flex flex-col gap-2 mt-2">
	<Listbox name="surveyId" labelText="Select survey">
		{#each data.surveyData as survey}
			<option value={survey.surveyId}>{survey.title}</option>
		{/each}
	</Listbox>
	<div class="py-2">
		<Checkbox
			name="allParents"
			labelText="Issue to all parents"
			bind:isChecked={allParentsChecked}
		/>
	</div>
	{#if !allParentsChecked}
		<div class="flex flex-col gap-1">
			<span class="text-sm">Select parents</span>
			<div class="rounded-xl bg-gray-100 border border-gray-300 p-3 flex flex-wrap gap-2">
				{#each addedParentList as parent}
					<div
						class="{stringToColour(parent.firstName)} text-white rounded-lg px-2 py-1 flex gap-2"
					>
						<span>{parent.firstName.concat(' ', parent.lastName)}</span>
						<button
							class="hover:cursor-pointer"
							on:click|preventDefault={() => removeParent(parent.parentId)}
						>
							<i class="fa-solid fa-multiply" />
						</button>
					</div>
				{/each}
				<button
					on:click|preventDefault={showParentPopup}
					class="bg-gray-900 hover:cursor-pointer hover:bg-gray-700 text-white rounded-lg px-2 py-1 max-w-max"
				>
					<i class="fa-solid fa-plus" />
				</button>
			</div>
		</div>
	{/if}

	<Button style="submit">Submit</Button>

	<!-- Hidden input to submit which parents are selected -->
	<!-- No user interaction is had with this element at all -->
	<input
		name="selectedParents"
		class="hidden"
		aria-hidden="true"
		type="text"
		bind:value={addedParentListFormEntry}
	/>
</form>

{#if showParentSelectPopup}
	<button
		class="absolute h-screen w-screen top-0 left-0 bg-black bg-opacity-80 flex items-center justify-center"
		on:click|preventDefault={hideParentPopup}
	>
		<div class="rounded-xl bg-gray-100 border border-gray-300 p-2 flex flex-col gap-2 w-64">
			<h3 class="font-bold text-xl">Select parent</h3>
			{#each data.parentData as parent}
				<button
					on:click|preventDefault={() => addParent(parent)}
					class="{stringToColour(
						parent.firstName
					)} hover:cursor-pointer hover:opacity-80 text-white rounded-lg px-2 py-1 max-w-max"
				>
					{parent.firstName.concat(' ', parent.lastName)}
				</button>
			{/each}
		</div>
	</button>
{/if}
