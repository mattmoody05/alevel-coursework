<script lang="ts">
	export let selected: boolean = false;
	export let iconClass: string;
	export let itemName: string;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<button
	on:click={() => dispatch('click')}
	class="flex gap-2 items-center p-3 hover:cursor-pointer rounded-lg md:w-64 h-10 {selected
		? 'bg-gray-900 hover:bg-gray-700 text-white font-bold'
		: 'hover:bg-gray-200'}"
>
	<div class="w-4 flex items-center justify-center"><i class={iconClass} /></div>
	<p class="md:block hidden">{itemName}</p>
</button>
