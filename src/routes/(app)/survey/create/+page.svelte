<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { LargeTextbox, Textbox } from '$lib/components/input';
</script>

<svelte:head>
	<title>Create survey</title>
</svelte:head>

<h3 class="font-bold text-xl">Create survey</h3>
<div class="grid lg:grid-cols-2 grid-cols-1 gap-8 pt-2">
	<div class="flex flex-col gap-2" id="survey-details">
		<Textbox name="title" placeholderText="Title" labelText="Survey title" />
		<LargeTextbox name="description" labelText="Survey description" />
		<div class="py-2"><Checkbox labelText="This survey is a consent form" /></div>
		<Checkbox labelText="This survey is anonymous" />
	</div>
	<hr class="block lg:hidden" />
	<div class="flex flex-col gap-4" id="survey-questions">
		<div class="flex flex-col gap-2" id="question">
			<Textbox labelText="Question 1" placeholderText="Prompt" />
			<Textbox placeholderText="Answer 1" />
			<Textbox placeholderText="Answer 2" />
		</div>
		<div class="flex flex-col gap-2" id="question">
			<Textbox labelText="Question 2" placeholderText="Prompt" />
			<Textbox placeholderText="Answer 1" />
			<Textbox placeholderText="Answer 2" />
		</div>
		<Button style="secondary">Add question</Button>
		<Button>Create survey</Button>
	</div>
</div>
