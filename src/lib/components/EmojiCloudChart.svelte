<script lang="ts">
	import { onMount } from 'svelte';
	import type { Chat } from '$lib/chat.svelte';
	import type { ListEntry } from 'wordcloud';
	import { scaleNumbers } from '$lib/utils/math';

	const { chat }: { chat: Chat } = $props();

	let container: HTMLElement;
	let canvas: HTMLCanvasElement;

	onMount(async () => {
		const WordCloud = (await import('wordcloud')).default;

		canvas.width = container.getBoundingClientRect().width;
		canvas.height = (canvas.width / 16) * 10;

		const words = chat.getEmojiCount('all', 50);
		const scaledValue = scaleNumbers(
			words.map((x) => x.count),
			1,
			10
		);

		const list = words.map((w, i) => [w.word, scaledValue[i]] as ListEntry);
		WordCloud(canvas, {
			list: list,
			backgroundColor: '#ffffff',
			shrinkToFit: true,
			drawOutOfBound: false,
			rotateRatio: 0,
			minSize: 10,
			gridSize: 2,
			weightFactor: 30
		});
	});
</script>

<div class="max-w-full" bind:this={container}>
	<canvas bind:this={canvas} width="1170" height="760"></canvas>
</div>
