<script lang="ts">
	export let title: string = '';
	export let content: string = '';
</script>

<div class="bg-red-300 p-2.5 rounded-xl flex flex-col">
	<span class="font-bold">{title}</span>
	<span class="text-sm leading-4">{content}</span>
</div>
