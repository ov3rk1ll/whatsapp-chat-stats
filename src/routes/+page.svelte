<script lang="ts">
	import { Chat } from '$lib/chat';
	import ChatResult from '$lib/components/ChatResult.svelte';
	import FileHandler from '$lib/components/FileHandler.svelte';

	let chat = $state<Chat | undefined>(undefined);
	let loading = $state<boolean>(false);
</script>

{#if chat == undefined && loading == false}
	<FileHandler
		bind:loading
		onload={(c) => (chat = c)}
		onerror={(err) => {
			alert(err);
		}}
	/>
{/if}

{#if loading}
	<div class="w-full">
		<div class="h-2 w-full bg-[#ece5dd] overflow-hidden">
			<div class="progress w-full h-full bg-[#128c7e] left-right"></div>
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
