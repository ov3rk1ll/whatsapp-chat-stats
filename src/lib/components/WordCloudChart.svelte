<script lang="ts">
	import { onMount } from 'svelte';
	import type { Chat } from '$lib/chat';
	import type { ListEntry } from 'wordcloud';

	const { chat }: { chat: Chat } = $props();

	let container: HTMLElement;
	let canvas: HTMLCanvasElement;

	const colorOptions = ['#f02222', '#ff5967', '#ff8ba7', '#ffbce1'];

	function scaleNumbers(numbers: number[], lowerLimit: number, upperLimit: number) {
		if (!numbers || numbers.length === 0) {
			return [];
		}

		// 1. Find the current range (min and max) of the input array
		const currentMin = Math.min(...numbers);
		const currentMax = Math.max(...numbers);

		// Check for the edge case where all numbers are the same
		if (currentMax === currentMin) {
			// If all numbers are identical, return an array where every element
			// is the midpoint of the new range, or the lower limit.
			const midpoint = (lowerLimit + upperLimit) / 2;
			return numbers.map(() => midpoint);
		}

		// 2. Calculate the size of the current and target ranges
		const currentRange = currentMax - currentMin;
		const targetRange = upperLimit - lowerLimit;

		// 3. Map each number to the new range
		const scaledNumbers = numbers.map((number) => {
			// a. Normalize the current number (position within the old range, 0 to 1)
			const normalizedValue = (number - currentMin) / currentRange;

			// b. Scale the normalized value to the new range size
			const scaledValue = normalizedValue * targetRange;

			// c. Shift the scaled value up by the new lower limit
			const finalValue = scaledValue + lowerLimit;

			return finalValue;
		});

		return scaledNumbers;
	}

	onMount(async () => {
		const WordCloud = (await import('wordcloud')).default;

		canvas.width = container.getBoundingClientRect().width;
		canvas.height = (canvas.width / 16) * 10;

		const words = chat.getWordCount('all', 75);
		const scaledValue = scaleNumbers(
			words.map((x) => x.count),
			1,
			160
		);

		const list = words.map((w, i) => [w.word, scaledValue[i]] as ListEntry);
		WordCloud(canvas, {
			list: list,
			shape: function (theta: number) {
				var max = 244;
				var leng = [
					195, 197, 198, 199, 201, 202, 203, 204, 205, 206, 208, 209, 210, 211, 212, 213, 214, 216,
					216, 217, 219, 219, 221, 221, 223, 223, 224, 226, 226, 227, 228, 228, 229, 231, 232, 232,
					232, 233, 234, 235, 236, 236, 237, 237, 238, 238, 239, 240, 240, 240, 241, 241, 241, 242,
					242, 242, 242, 242, 242, 243, 242, 242, 243, 242, 242, 242, 243, 242, 241, 241, 241, 241,
					241, 240, 240, 240, 239, 238, 238, 237, 236, 236, 236, 235, 235, 234, 233, 232, 232, 231,
					231, 229, 228, 228, 227, 226, 225, 224, 223, 222, 221, 220, 219, 218, 216, 215, 214, 214,
					213, 210, 209, 208, 207, 206, 204, 203, 201, 200, 200, 198, 196, 195, 193, 192, 190, 188,
					186, 186, 183, 182, 180, 179, 176, 175, 172, 171, 168, 167, 164, 162, 160, 158, 155, 153,
					150, 148, 146, 143, 139, 138, 134, 130, 128, 126, 121, 118, 115, 112, 117, 120, 123, 125,
					130, 132, 136, 138, 141, 144, 147, 150, 152, 155, 157, 160, 162, 164, 166, 169, 170, 173,
					174, 177, 178, 181, 182, 184, 185, 187, 188, 190, 192, 194, 195, 197, 198, 200, 201, 202,
					203, 205, 206, 208, 209, 210, 211, 212, 214, 216, 216, 217, 218, 220, 221, 222, 223, 224,
					224, 226, 226, 228, 228, 229, 230, 231, 232, 232, 234, 234, 235, 236, 237, 237, 237, 238,
					239, 239, 239, 240, 240, 241, 241, 242, 242, 242, 243, 243, 243, 243, 244, 244, 243, 244,
					243, 244, 243, 243, 244, 243, 243, 244, 242, 242, 242, 241, 241, 241, 241, 240, 240, 240,
					238, 238, 237, 236, 236, 235, 234, 233, 234, 233, 232, 231, 230, 230, 228, 227, 226, 226,
					224, 224, 223, 221, 221, 219, 218, 217, 216, 215, 214, 213, 212, 210, 209, 209, 208, 205,
					204, 204, 203, 201, 200, 199, 198, 197, 196, 194, 193, 192, 191, 189, 188, 187, 186, 184,
					183, 183, 181, 179, 179, 177, 177, 175, 174, 174, 172, 171, 170, 169, 168, 167, 166, 165,
					164, 163, 163, 161, 161, 160, 159, 158, 158, 157, 156, 155, 154, 153, 153, 152, 152, 152,
					150, 150, 149, 149, 148, 147, 147, 146, 146, 145, 145, 144, 144, 144, 143, 143, 142, 142,
					141, 141, 140, 140, 140, 140, 139, 139, 139, 139, 139, 138, 138, 138, 138, 137, 137, 137,
					137, 137, 137, 137, 137, 137, 136, 136, 136, 136, 137, 136, 137, 137, 136, 137, 137, 137,
					137, 137, 137, 137, 138, 138, 138, 139, 139, 138, 139, 139, 140, 140, 140, 141, 141, 142,
					142, 142, 142, 143, 144, 145, 145, 145, 146, 147, 148, 148, 149, 150, 150, 151, 152, 153,
					154, 155, 156, 157, 158, 160, 160, 162, 163, 164, 167, 167, 169, 171, 173, 176, 177, 181,
					184, 186, 189, 186, 182, 179, 178, 175, 172, 171, 169, 167, 165, 164, 162, 161, 160, 159,
					157, 156, 155, 154, 153, 152, 151, 151, 150, 149, 148, 147, 147, 146, 145, 145, 144, 144,
					143, 143, 142, 141, 141, 141, 140, 140, 140, 140, 139, 139, 138, 138, 137, 138, 138, 137,
					137, 137, 137, 136, 137, 136, 136, 136, 135, 136, 136, 136, 135, 136, 135, 135, 136, 136,
					135, 135, 136, 136, 136, 136, 136, 136, 136, 136, 137, 137, 137, 137, 138, 138, 138, 139,
					139, 139, 139, 140, 140, 141, 141, 141, 142, 142, 142, 143, 143, 144, 144, 145, 146, 146,
					146, 148, 148, 148, 149, 149, 150, 151, 151, 152, 153, 154, 155, 155, 156, 156, 157, 158,
					159, 159, 160, 162, 163, 163, 164, 166, 166, 167, 168, 169, 171, 170, 172, 173, 174, 175,
					177, 178, 178, 180, 181, 183, 183, 184, 185, 187, 188, 189, 190, 192, 193, 194, 197
				];

				return leng[((theta / (2 * Math.PI)) * leng.length) | 0] / max;
			},
			backgroundColor: '#ffffff',
			shrinkToFit: true,
			drawOutOfBound: false,
			rotateRatio: 0.5,
			rotationSteps: 2,
			minSize: 10,
			gridSize: 2,
			color: function (
				word: string,
				weight: string | number,
				fontSize: number,
				distance: number,
				theta: number
			) {
				console.log(distance);
				return colorOptions[distance % colorOptions.length];
			}
		});
	});
</script>

<div class="max-w-full" bind:this={container}>
	<canvas bind:this={canvas} width="1170" height="760"></canvas>
</div>
