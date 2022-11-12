<script lang="ts">
	import { LinkButton } from '$lib/components/button';
</script>

<!-- <div class="grid grid-rows-2 gap-4 h-full">
	<div class="bg-green-500 rounded-xl flex justify-center items-center">
		<h1 class="font-bold text-white text-3xl">Two way messaging</h1>
	</div>
	<div class="bg-red-500 rounded-xl flex justify-center items-center">
		<h1 class="font-bold text-white text-3xl">Short notice notifications</h1>
	</div>
</div> -->

<div class="flex flex-col gap-4">
	<LinkButton href="/messaging/two-way" style="secondary">Two way messaging</LinkButton>
	<LinkButton href="/messaging/short-notice/create" style="secondary"
		>Create short notice</LinkButton
	>
	<LinkButton href="/messaging/short-notice/view" style="secondary">View short notice</LinkButton>
</div>
