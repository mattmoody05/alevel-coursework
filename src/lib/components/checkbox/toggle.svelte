<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isChecked: boolean = false;
	export let leftLabelText: string = '';
	export let rightLabelText: string = '';
	export let name: string = '';

	const dispatch = createEventDispatcher();

	// Dispatches a custom event
	// Includes data regarding the checked status, label text and name of the checkbox
	function onChangeDispatcher() {
		dispatch('change', { isChecked, name, leftLabelText, rightLabelText });
	}
</script>

<div class="flex">
	<span class="mr-2 duration-150 {isChecked ? '' : 'font-bold'}">{leftLabelText}</span>
	<label for="componentToggle" class="inline-flex relative items-center cursor-pointer">
		<input
			bind:checked={isChecked}
			type="checkbox"
			id="componentToggle"
			class="sr-only peer"
			{name}
			on:change={onChangeDispatcher}
		/>
		<div
			class="w-11 h-6 bg-gray-200 peer-focus:ring-none rounded-full peer
            peer-checked:after:translate-x-full peer-checked:after:border-white
            after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
            after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
            peer-checked:bg-blue-600 peer-checked:border-none"
		/>
	</label>
	<span class="ml-2 duration-150 {isChecked ? 'font-bold' : ''}">{rightLabelText}</span>
</div>
