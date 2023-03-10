<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isChecked: boolean = false;
	export let labelText: string = '';
	export let name: string = '';

	const dispatch = createEventDispatcher();

	// Dispatches a custom event
	// Includes data regarding the checked status, label text and name of the checkbox
	function onChangeDispatcher() {
		dispatch('change', { isChecked, labelText, name });
	}
</script>

<div class="flex gap-2">
	<input
		id="componentCheckbox"
		type="checkbox"
		bind:checked={isChecked}
		class="focus:ring-transparent hover:cursor-pointer w-6 h-6 text-blue-600 bg-gray-100 rounded-lg border-gray-300"
		{name}
		on:change={onChangeDispatcher}
	/>
	{#if labelText !== ''}
		<label for="componentCheckbox">{labelText}</label>
	{/if}
</div>
