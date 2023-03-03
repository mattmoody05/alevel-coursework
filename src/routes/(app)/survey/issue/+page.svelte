<script lang="ts">
	import { Listbox } from '$lib/components/input';
	import { stringToColour } from '$lib/util/ui';
	import type { ActionData, PageData } from './$types';

	import type { parent } from '$lib/util/types';
	import { Checkbox } from '$lib/components/checkbox';
	import { Button } from '$lib/components/button';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { SmallAlert } from '$lib/components/alert';

	export let data: PageData;
	export let form: ActionData;

	let showParentSelectPopup: boolean = false;

	let addedParentList: parent[] = [];

	function showParentPopup() {
		showParentSelectPopup = true;
	}

	function hideParentPopup() {
		showParentSelectPopup = false;
	}

	function removeParent(parentId: string) {
		addedParentList = addedParentList.filter((item) => item.parentId !== parentId);
	}

	function addParent(parent: parent) {
		addedParentList = [...addedParentList, parent];
	}

	let allParentsChecked: boolean = true;

	$: addedParentListFormEntry = JSON.stringify(addedParentList);

	onMount(() => {
		if (form?.success) {
			setTimeout(() => {
				// @ts-ignore
				form.success = false;
			}, 5000);
		}
	});
</script>

{#if form?.success}
	<div out:fade>
		<SmallAlert style="success" body="Survey has been issued successfully" title="Success" />
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
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div class="hover:cursor-pointer" on:click={() => removeParent(parent.parentId)}>
							<i class="fa-solid fa-multiply" />
						</div>
					</div>
				{/each}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					on:click={showParentPopup}
					class="bg-gray-900 hover:cursor-pointer hover:bg-gray-700 text-white rounded-lg px-2 py-1 max-w-max"
				>
					<i class="fa-solid fa-plus" />
				</div>
			</div>
		</div>
	{/if}

	<Button style="submit">Submit</Button>

	<!-- Hidden input to submit which parents are selected -->
	<input
		name="selectedParents"
		class="hidden"
		aria-hidden="true"
		type="text"
		bind:value={addedParentListFormEntry}
	/>
</form>

{#if showParentSelectPopup}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="absolute h-screen w-screen top-0 left-0 bg-black bg-opacity-80 flex items-center justify-center"
		on:click={hideParentPopup}
	>
		<div class="rounded-xl bg-gray-100 border border-gray-300 p-2 flex flex-col gap-2 w-64">
			<h3 class="font-bold text-xl">Select parent</h3>
			{#each data.parentData as parent}
				<div
					on:click={() => addParent(parent)}
					class="{stringToColour(
						parent.firstName
					)} hover:cursor-pointer hover:opacity-80 text-white rounded-lg px-2 py-1 max-w-max"
				>
					{parent.firstName.concat(' ', parent.lastName)}
				</div>
			{/each}
		</div>
	</div>
{/if}
