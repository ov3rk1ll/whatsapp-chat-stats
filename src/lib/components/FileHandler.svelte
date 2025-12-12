<script lang="ts">
	import JSZip from 'jszip';
	import { Chat } from '$lib/chat';
	import type { ChangeEventHandler } from 'svelte/elements';

	let {
		loading = $bindable<boolean>(false),
		onload,
		onerror
	}: { loading: boolean; onload: (chat: Chat) => void; onerror: (error: any) => void } = $props();

	function handleFileInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		const files = (e.target as HTMLInputElement).files;
		if (files == null || files.length != 1) {
			onerror('Only drop one file!');
			return;
		}

		const file = files[0];
		const reader = new FileReader();
		reader.onerror = () => {
			onerror(reader.error);
		};
		if (/^application\/(?:x-)?zip(?:-compressed)?$/.test(file.type)) {
			loading = true;
			reader.onload = () => handleZipFile(reader.result);
			reader.readAsArrayBuffer(file);
		} else if (file.type === 'text/plain') {
			loading = true;
			reader.onload = () => handleTextFile(reader.result);
			reader.readAsText(file);
		} else {
			onerror('Unable to handle file format');
		}
	}

	function handleZipFile(result: FileReader['result']) {
		const jszip = new JSZip();
		const zip = jszip.loadAsync(result as ArrayBuffer);

		zip
			.then((zipData) => findChatFile(zipData))
			.then((chatFile) => {
				onload(new Chat(chatFile));
				loading = false;
			});
	}

	async function findChatFile(zipData: JSZip) {
		const chatFile = zipData.file('_chat.txt');
		if (chatFile) return chatFile.async('string');

		return await zipData
			.file(/.*(?:chat|whatsapp).*\.txt$/i)
			.sort((a, b) => a.name.length - b.name.length)[0]
			.async('string');
	}

	function handleTextFile(result: FileReader['result']) {
		onload(new Chat(result as string));
		loading = false;
	}
</script>

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
