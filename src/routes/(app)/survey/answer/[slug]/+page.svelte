<script lang="ts">
	import { Button } from '$lib/components/button';
</script>

<svelte:head>
	<title>Answer survey</title>
</svelte:head>

<div class="flex flex-col justify-between h-full gap-2">
	<div class="header">
		<h3 class="font-bold text-xl">Answer survey</h3>
		<span class="font-bold">Survey name: </span>Photo consent form for 2022
	</div>

	<div
		class="main-question-content h-full w-full bg-gray-100 border border-gray-300 rounded-xl flex flex-col justify-between"
	>
		<div class="flex items-center justify-center h-full w-full">
			<p class="font-bold text-lg">Question prompt here, how amazing</p>
		</div>
		<div class="flex-col flex gap-2 m-2">
			<Button>Option 1</Button>
			<Button>Option 2</Button>
			<Button>Option 3</Button>
		</div>
	</div>

	<div class="flex justify-between gap-2 items-center">
		<div class="min-w-max w-32">
			<Button>
				<div class="flex gap-2 items-center justify-center">
					<i class="fa-solid fa-arrow-left" /> <span>Previous</span>
				</div>
			</Button>
		</div>
		<div class="opacity-50">Question 1</div>
		<div class="min-w-max w-32">
			<Button>
				<div class="flex gap-2 items-center justify-center">
					<span>Next</span> <i class="fa-solid fa-arrow-right" />
				</div>
			</Button>
		</div>
	</div>
</div>
