<script lang="ts">
	import { Chat } from '$lib/chat';
	import ChatResult from '$lib/components/ChatResult.svelte';

	let chat = $state<Chat | undefined>(undefined);
	let loading = $state<boolean>(false);

	function handleFileInput(e: Event & { target: HTMLInputElement }) {
		loading = true;
		const file = e?.target?.files?.[0];
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			chat = new Chat(reader.result as string);
			loading = false;
		};
		reader.readAsText(file);
	}
</script>

{#if chat == undefined && loading == false}
	<div class="flex items-center justify-center w-full">
		<label
			for="dropzone-file"
			class="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
		>
			<div class="flex flex-col items-center justify-center text-body pt-5 pb-6">
				<svg
					class="w-8 h-8 mb-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
					/></svg
				>
				<p class="mb-2 text-sm">
					<span class="font-semibold">Click to select</span> or drag and drop
				</p>
				<p class="text-xs">WhatsApp Chat export TXT</p>
			</div>
			<input id="dropzone-file" type="file" class="hidden" onchange={handleFileInput} />
		</label>
	</div>
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
