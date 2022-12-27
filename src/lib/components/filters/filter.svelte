<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Checkbox from '../checkbox/checkbox.svelte';
	import Textbox from '../input/textbox.svelte';
	const dispatch = createEventDispatcher();

	type filterTypes = 'Date' | 'Parent' | 'Child' | 'Length' | 'Type' | 'Name';

	export let filterType: filterTypes[] = [];
	export let allowedFilterTypes: filterTypes[];

	let showFilterOptions: boolean = false;

	function toggleShowFilterOptions() {
		showFilterOptions = !showFilterOptions;
	}

	function handleCheckboxChange(e: CustomEvent<{ isChecked: boolean; labelText: string }>) {
		const isChecked = e.detail.isChecked;
		const labelText = e.detail.labelText as filterTypes;
		if (isChecked) {
			filterType = [...filterType, labelText];
		} else {
			filterType = filterType.filter((currentFilterType) => currentFilterType !== labelText);
		}
	}
</script>

{#if allowedFilterTypes.length > 0}
	<div class="relative">
		<button
			on:click={toggleShowFilterOptions}
			type="button"
			class="bg-gray-100 border border-gray-300 rounded-xl text-sm py-2 px-4 hover:opacity-50 peer"
		>
			<div class="flex gap-2 items-center">
				<i class="fa-solid fa-filter" />
				<span>Filter</span>
			</div>
		</button>
		<div
			class="{showFilterOptions
				? 'flex'
				: 'hidden'} absolute mt-2 bg-gray-100 border border-gray-300 rounded-lg  flex-col gap-2 p-4 min-w-max shadow-xl"
		>
			<h3 class="font-bold">Select filters</h3>
			{#each allowedFilterTypes as currentFilterType}
				<div class="flex items-center gap-4">
					<Checkbox labelText={currentFilterType} on:change={handleCheckboxChange} />
					<div class="flex justify-end w-full">
						<Textbox />
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
