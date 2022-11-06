<script lang="ts">
	export let title: string = '';
	export let content: string = '';
</script>

<div class="bg-red-300 p-2.5 rounded-xl flex flex-col leading-4 gap-1">
	<span class="font-bold">{title}</span>
	{content}
</div>
