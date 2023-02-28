<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Toggle } from '$lib/components/checkbox';
	import { LargeTextbox } from '$lib/components/input';
	import { stringToColour } from '$lib/util/ui';
	import type { ActionData, PageData } from './$types';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { ParentTable } from '$lib/util/newDb';

	export let data: PageData;
	export let form: ActionData;

	let showParentSelectPopup: boolean = false;

	let addedParentList: ParentTable[] = [];

	function showParentPopup() {
		showParentSelectPopup = true;
	}

	function hideParentPopup() {
		showParentSelectPopup = false;
	}

	function removeParent(parentId: string) {
		addedParentList = addedParentList.filter((item) => item.parentId !== parentId);
	}

	function addParent(parent: ParentTable) {
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
		if (form?.message !== undefined) {
			setTimeout(() => {
				// @ts-ignore
				form.message = undefined;
			}, 10000);
		}
	});
</script>

<svelte:head>
	<title>Create short notice notification</title>
</svelte:head>

{#if form?.success}
	<div out:fade>
		<SmallAlert
			style="success"
			body="Notification has been created and issued successfully"
			title="Success"
		/>
	</div>
{/if}

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

<div class="flex flex-col gap-2">
	<h3 class="font-bold text-xl">Notify parents</h3>
	<form action="?/createNotification" method="POST" class="flex flex-col gap-2">
		<Toggle
			name="allParents"
			leftLabelText="Some parents"
			rightLabelText="All parents"
			bind:isChecked={allParentsChecked}
		/>
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
		<LargeTextbox name="message" placeholderText="Type a message..." labelText="Message to issue" />
		<!-- Hidden input to submit which parents are selected -->
		<input
			name="selectedParents"
			class="hidden"
			aria-hidden="true"
			type="text"
			bind:value={addedParentListFormEntry}
		/>
		<Button style="submit">Issue message</Button>
	</form>
</div>

{#if showParentSelectPopup}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="absolute h-screen w-screen top-0 left-0 bg-black bg-opacity-80 flex items-center justify-center"
		on:click={hideParentPopup}
	>
		<div class="rounded-xl bg-gray-100 border border-gray-300 p-2 flex flex-col gap-2 w-64">
			<h3 class="font-bold text-xl">Select parent</h3>
			{#each data.parents as parent}
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
