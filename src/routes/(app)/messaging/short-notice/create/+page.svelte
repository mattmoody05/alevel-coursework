<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Toggle } from '$lib/components/checkbox';
	import { LargeTextbox } from '$lib/components/input';
	import type { parentSummary } from '$lib/util/types';
	import { stringToColour } from '$lib/util/ui';

	let showParentSelectPopup: boolean = false;

	let addedParentList: parentSummary[] = [
		{
			id: 'idhere',
			name: 'Jon Doe'
		},
		{
			id: 'idhere',
			name: 'Jon Doe'
		},
		{
			id: 'idhere',
			name: 'Jon Doe'
		},
		{
			id: 'idhere',
			name: 'Jon Doe'
		},
		{
			id: 'idhere',
			name: 'Jon Doe'
		}
	];

	function showParentPopup() {
		// getParentList()
		showParentSelectPopup = true;
	}

	function hideParentPopup() {
		showParentSelectPopup = false;
	}

	function removeParent(parentId: string) {
		return;
	}

	let allParentsChecked: boolean = true;
</script>

<div class="flex flex-col gap-2">
	<h3 class="font-bold text-xl">Notify parents</h3>
	<Toggle
		leftLabelText="Some parents"
		rightLabelText="All parents"
		bind:isChecked={allParentsChecked}
	/>
	{#if !allParentsChecked}
		<div class="flex flex-col gap-1">
			<span class="text-sm">Select parents</span>
			<div class="rounded-xl bg-gray-100 border border-gray-300 p-3 flex flex-wrap gap-2">
				{#each addedParentList as parent}
					<div class="{stringToColour(parent.name)} text-white rounded-lg px-2 py-1 flex gap-2">
						<span>{parent.name}</span>
						<button on:click={() => removeParent(parent.id)}
							><i class="fa-solid fa-multiply" /></button
						>
					</div>
				{/each}
				<button
					on:click={showParentPopup}
					class="bg-gray-900 hover:bg-gray-700 text-white rounded-lg px-2 py-1 max-w-max"
				>
					<i class="fa-solid fa-plus" />
				</button>
			</div>
		</div>
	{/if}
	<LargeTextbox placeholderText="Type a message..." labelText="Message to issue" />
	<Button>Issue message</Button>
</div>

{#if showParentSelectPopup}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="absolute h-screen w-screen top-0 left-0 bg-black bg-opacity-80 flex items-center justify-center"
		on:click={hideParentPopup}
	>
		<div class="rounded-xl bg-gray-100 border border-gray-300 p-2 flex flex-col gap-2 w-64">
			<h3 class="font-bold text-xl">Select parent</h3>
			<button class="{stringToColour('Jon Doe')} text-white rounded-lg px-2 py-1 max-w-max"
				>Jon Doe</button
			>
			<button class="{stringToColour('Jon Doe')} text-white rounded-lg px-2 py-1 max-w-max"
				>Jon Doe</button
			>
			<button class="{stringToColour('Jon Doe')} text-white rounded-lg px-2 py-1 max-w-max"
				>Jon Doe</button
			>
			<button class="{stringToColour('Jon Doe')} text-white rounded-lg px-2 py-1 max-w-max"
				>Jon Doe</button
			>
		</div>
	</div>
{/if}
