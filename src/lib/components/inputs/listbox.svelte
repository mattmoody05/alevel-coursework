<script lang="ts">
	export let placeholderOption: string = 'Select';
	export let labelText: string = '';
	export let value: string = '';
</script>

<div class="flex flex-col gap-1">
	<label for="countries" class="text-sm">{labelText}</label>
	<select
		id="countries"
		class="bg-gray-100 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
		bind:value
	>
		<option selected value="">{placeholderOption}</option>
		<slot />
	</select>
</div>
