<script lang="ts">
	import { LinkButton } from '$lib/components/button';
</script>

<svelte:head>
	<title>Absence centre</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<LinkButton style="secondary" href="/absence/report">Report an absence</LinkButton>
	<LinkButton style="secondary" href="/absence/view">View absences</LinkButton>
</div>
