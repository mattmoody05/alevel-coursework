<script lang="ts">
	type sortTypes = 'None' | 'Date' | 'Parent' | 'Child' | 'Length' | 'Type' | 'Name';

	export let sortType: sortTypes = 'None';
	export let allowedSortTypes: sortTypes[] = ['None'];

	let showSortOptions: boolean = false;

	function toggleShowSortOptions() {
		showSortOptions = !showSortOptions;
	}
</script>

{#if allowedSortTypes.length > 0}
	<div class="relative">
		<button
			on:click={toggleShowSortOptions}
			type="button"
			class="bg-gray-100 border border-gray-300 rounded-xl text-sm py-2 px-4 hover:opacity-50 peer"
		>
			<div class="flex gap-2 items-center">
				<i class="fa-solid fa-arrow-up-a-z" />
				<span>Sort</span>
			</div>
		</button>
		<div
			class="{showSortOptions
				? 'flex'
				: 'hidden'} absolute mt-2 bg-gray-100 border border-gray-300 rounded-lg  flex-col gap-2 p-4 min-w-max shadow-xl"
		>
			<h3 class="font-bold">Select sort</h3>
			{#each allowedSortTypes as currentSortType}
				<div class="flex items-center min-w-max">
					<input
						id="componentRadioButton"
						type="radio"
						class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
						value={currentSortType}
						name="sortType"
						bind:group={sortType}
					/>
					<label for="componentRadioButton" class="ml-2 text-gray-900">{currentSortType}</label>
				</div>
			{/each}
		</div>
	</div>
{/if}
