<script lang="ts">
	import { Chat } from '$lib/chat.svelte';
	import ChatResult from '$lib/components/ChatResult.svelte';
	import FileHandler from '$lib/components/FileHandler.svelte';

	let chat = $state<Chat | undefined>(undefined);
	let loading = $state<boolean>(false);
</script>

{#if chat == undefined && loading == false}
	<p class="my-2 text-center">
		<span class="font-bold">All processing is done locally on your device!</span> No chat data is sent,
		stored, or shared anywhere.
	</p>
	<FileHandler
		bind:loading
		onload={(c) => {
			chat = c;
			// chat.authorNameMap['Katrin 🍓 Leitner'] = 'Katrin';
			chat.authorNameMap['all'] = 'Together';
		}}
		onerror={(err) => {
			alert(err);
		}}
	/>
{/if}

{#if loading}
	<div class="w-full">
		<div class="h-2 w-full bg-surface-100 overflow-hidden">
			<div class="progress w-full h-full bg-secondary-500 left-right"></div>
		</div>
	</div>
{/if}

{#if chat}
	<ChatResult {chat} />
{/if}

<style>
	.progress {
		animation: progress 1s infinite linear;
	}

	.left-right {
		transform-origin: 0% 50%;
	}
	@keyframes progress {
		0% {
			transform: translateX(0) scaleX(0);
		}
		40% {
			transform: translateX(0) scaleX(0.4);
		}
		100% {
			transform: translateX(100%) scaleX(0.5);
		}
	}
</style>
