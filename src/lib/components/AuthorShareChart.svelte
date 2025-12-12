<script lang="ts">
	import type { Chat } from '$lib/chat';
	import { chatColors } from '$lib/utils/colors';
	import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
	import 'chartjs-adapter-moment';
	import { onMount } from 'svelte';

	const { chat }: { chat: Chat } = $props();

	Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

	let canvas: HTMLCanvasElement;

	const chartData = $derived({
		labels: chat.getAuthors(),
		datasets: [
			{
				label: 'Messages per person',
				data: chat.getAuthors().map((a) => chat.getMessagesBy(a).length),
				backgroundColor: chat.getAuthors().map((a, idx) => chatColors[idx % chatColors.length]),
				borderColor: chat.getAuthors().map((a, idx) => chatColors[idx % chatColors.length])
			}
		]
	});

	onMount(() => {
		new Chart(canvas, {
			type: 'doughnut',
			data: chartData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom'
					},
					tooltip: {
						enabled: true,
						callbacks: {
							title: () => '',
							label: (context) => {
								let label = context.label || '';

								if (label) {
									label += ': ' + context.parsed;
								}

								return label;
							}
						}
					}
				}
			}
		});
	});
</script>

<h3 class="text-2xl font-thin mx-auto text-center">Messages per person</h3>
<div class="min-h-[480px] p-4">
	<canvas bind:this={canvas}></canvas>
</div>
