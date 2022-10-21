<script lang="ts">
	export let placeholderText: string = '';
	export let labelText: string = '';
	export let textboxContent: string = '';
</script>

<div class="flex flex-col-reverse gap-1">
	<input
		type="text"
		id="componentTextbox"
		class="bg-gray-100 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
		placeholder={placeholderText}
		bind:value={textboxContent}
	/>
	{#if labelText !== ''}
		<label for="componentTextbox" class="text-sm">{labelText}</label>
	{/if}
</div>
