<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isChecked: boolean = false;
	export let labelText: string = '';
	export let name: string = '';

	const dispatch = createEventDispatcher();
</script>

<div class="flex gap-2">
	<input
		id="componentCheckbox"
		type="checkbox"
		bind:checked={isChecked}
		class="focus:ring-transparent hover:cursor-pointer w-6 h-6 text-blue-600 bg-gray-100 rounded-lg border-gray-300"
		{name}
		on:change={() => dispatch('change', { isChecked, labelText, name })}
	/>
	{#if labelText !== ''}
		<label for="componentCheckbox">{labelText}</label>
	{/if}
</div>
