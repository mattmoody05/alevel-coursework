<script lang="ts">
	export let placeholderText: string = '';
	export let labelText: string = '';
	export let value: string = '';
	export let isPassword: boolean = false;
	export let name: string = '';
</script>

<div class="flex flex-col gap-1">
	{#if labelText !== ''}
		<label for="componentTextbox" class="text-sm">{labelText}</label>
	{/if}
	{#if isPassword}
		<input
			type="password"
			id="componentTextbox"
			class="bg-gray-100 border border-gray-300 rounded-xl block w-full p-3"
			placeholder={placeholderText}
			bind:value
			{name}
		/>
	{:else}
		<input
			type="text"
			id="componentTextbox"
			class="bg-gray-100 border border-gray-300 rounded-xl block w-full p-3"
			placeholder={placeholderText}
			bind:value
			{name}
		/>
	{/if}
</div>
