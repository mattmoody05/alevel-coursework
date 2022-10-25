<script lang="ts">
	export let placeholderOption: string = 'Select';
	export let labelText: string = '';
	export let value: string = '';
</script>

<div class="flex flex-col gap-1">
	{#if labelText !== ''}
		<label for="componentListbox" class="text-sm">{labelText}</label>
	{/if}
	<select
		id="componentListbox"
		class="bg-gray-100 border border-gray-300 rounded-xl block w-full p-3"
		bind:value
	>
		<option selected value="">{placeholderOption}</option>
		<slot />
	</select>
</div>
