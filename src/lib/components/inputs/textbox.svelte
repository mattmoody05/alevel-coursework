<script lang="ts">
	export let placeholderText: string = '';
	export let labelText: string = '';
	export let value: string = '';
	export let isPassword: boolean = false;
</script>

<div class="flex flex-col-reverse gap-1">
	{#if isPassword}
		<input
			type="password"
			id="componentTextbox"
			class="bg-gray-100 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
			placeholder={placeholderText}
			bind:value
		/>
	{:else}
		<input
			type="text"
			id="componentTextbox"
			class="bg-gray-100 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
			placeholder={placeholderText}
			bind:value
		/>
	{/if}
	{#if labelText !== ''}
		<label for="componentTextbox" class="text-sm">{labelText}</label>
	{/if}
</div>
