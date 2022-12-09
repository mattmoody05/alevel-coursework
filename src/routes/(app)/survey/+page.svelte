<script lang="ts">
	import { LinkButton } from '$lib/components/button';
</script>

<svelte:head>
	<title>Survey centre</title>
</svelte:head>

<div class="flex gap-4 flex-col">
	<LinkButton style="secondary" href="/survey/create">Create survey</LinkButton>
	<LinkButton style="secondary" href="/survey/issue">Issue survey</LinkButton>
	<LinkButton style="secondary" href="/survey/answer">Answer survey</LinkButton>
</div>
