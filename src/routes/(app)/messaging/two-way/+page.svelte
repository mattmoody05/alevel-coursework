<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Textbox } from '$lib/components/input';
	import { TwoWayMessage } from '$lib/components/messages';
	import { afterUpdate } from 'svelte';
	import type { messageSummary } from '$lib/util/types';

	export let messages: messageSummary[] = [
		{
			id: 'idhere',
			content: 'Hi, how can I make a booking with you?',
			fromOwner: false
		},
		{
			id: 'idhere',
			content:
				'Hi there! Just head over to the session booking menu from the dashboard and you can book a session there!',
			fromOwner: true
		},
		{
			id: 'idhere',
			content:
				'That’s great, thank you! Can you let me know once the booking has been made please?',
			fromOwner: false
		},
		{
			id: 'idhere',
			content:
				'Yes, the system will automatically send an email once the session has been confirmed.',
			fromOwner: true
		},
		{
			id: 'idhere',
			content: 'That’s amazing - I’ll book now. Thanks.',
			fromOwner: false
		}
	];
	export let chattingWith: string = 'Tracey';

	let textboxContent: string = '';
	let conversationViewElement: HTMLElement;

	function pushMessage() {
		if (textboxContent !== '') {
			messages = [...messages, { id: 'idhere', content: textboxContent, fromOwner: false }];
			textboxContent = '';
		}
	}
	function scrollToBottom(element: HTMLElement) {
		element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
	}
	function handleKeyPress(ev: KeyboardEvent) {
		// Checks if the pressed key is the enter key
		if (ev.keyCode === 13) {
			pushMessage();
		}
	}

	afterUpdate(() => {
		scrollToBottom(conversationViewElement);
	});
</script>

<div class="flex justify-between flex-col h-full">
	<div id="chatting-with-banner">
		<h3 class="font-bold text-xl">Two way messaging</h3>
		<span class="font-bold">Chatting with: </span> <span>{chattingWith}</span>
	</div>
	<div
		id="messages"
		class="flex flex-col overflow-y-scroll h-full"
		bind:this={conversationViewElement}
	>
		<div class="h-full" />
		{#each messages as message}
			<TwoWayMessage messageStyle={message.fromOwner ? 'incoming' : 'outgoing'}>
				{message.content}
			</TwoWayMessage>
		{/each}
	</div>
	<!-- Fix weird border cut off issue with below -->
	<!-- for time being margin has been added -->
	<div id="lower-buttons" class="m-0.5">
		<div class="flex gap-4 mt-4 h-max">
			<div class="w-full" on:keypress={handleKeyPress}>
				<Textbox bind:value={textboxContent} placeholderText="Type a message..." />
			</div>
			<div class="min-w-max w-32">
				<Button on:click={pushMessage}>Send</Button>
			</div>
		</div>
	</div>
</div>
