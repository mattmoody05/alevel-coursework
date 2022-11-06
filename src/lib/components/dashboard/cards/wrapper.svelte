<script lang="ts">
	export let title: string = 'CardWrapper title';
</script>

<div class="p-4 rounded-xl border border-gray-300 bg-gray-100">
	<h3 class="font-bold text-xl">{title}</h3>
	<slot />
</div>
