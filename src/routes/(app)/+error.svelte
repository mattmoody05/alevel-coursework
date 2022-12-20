<script lang="ts">
	import { page } from '$app/stores';
</script>

<h3 class="font-bold text-xl">Error {$page.status}</h3>
{#if $page.error?.message}
	<p class="leading-4 mt-2">{$page.error.message}</p>
{/if}
