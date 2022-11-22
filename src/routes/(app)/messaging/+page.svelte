<script lang="ts">
	import { LinkButton } from '$lib/components/button';
</script>

<svelte:head>
	<title>Messaging centre</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<LinkButton href="/messaging/two-way" style="secondary">Two way messaging centre</LinkButton>
	<LinkButton href="/messaging/short-notice/create" style="secondary"
		>Create short notice notification</LinkButton
	>
	<LinkButton href="/messaging/short-notice/view" style="secondary"
		>View short notice notification</LinkButton
	>
</div>
