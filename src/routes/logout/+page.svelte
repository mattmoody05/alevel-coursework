<script lang="ts">
	import { LinkButton } from '$lib/components/button';
</script>

<svelte:head>
	<title>Logout</title>
</svelte:head>

<main>
	<div class="grid grid-cols-1 md:grid-cols-2 h-screen">
		<div class="h-full flex justify-center flex-col">
			<div class="flex flex-col gap-2 m-8">
				<h3 class="font-bold text-xl">Logged out successfully</h3>
				<div class="max-w-max">
					<LinkButton href="/login" style="secondary">Go to login</LinkButton>
				</div>
			</div>
		</div>
		<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-200 hidden md:block" />
	</div>
</main>
