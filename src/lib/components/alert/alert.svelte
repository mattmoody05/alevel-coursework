<script lang="ts">
	import { Button } from '$lib/components/button';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let title: string;
	export let body: string;
	export let buttonText: string;
	export let secondaryButtonText: string = '';

	function primaryButtonDispatcher() {
		dispatch('primary-click');
	}
	function secondaryButtonDispatcher() {
		dispatch('secondary-click');
	}
</script>

<div class="bg-gray-100 p-4 m-4 rounded-3xl">
	<h1 class="font-bold text-2xl">{title}</h1>
	<p class="opacity-50 leading-5">{body}</p>
	<div class="flex justify-between mt-4">
		{#if secondaryButtonText !== ''}
			<Button style="secondary">{secondaryButtonText}</Button>
		{/if}
		<Button style="primary">{buttonText}</Button>
	</div>
</div>
