<script lang="ts">
	import type { Chat } from '$lib/chat.svelte';
	import { chatColors } from '$lib/utils/colors';
	import { Chart, BarController, BarElement } from 'chart.js';
	import 'chartjs-adapter-moment';
	import { onMount } from 'svelte';

	const { chat, dataGrouping }: { chat: Chat; dataGrouping: 'hourly' } = $props();

	Chart.register(BarController, BarElement);

	let canvas: HTMLCanvasElement;

	let chart: Chart | undefined = undefined;

	const chartData = $derived({
		labels: [
			'0',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'10',
			'11',
			'12',
			'13',
			'14',
			'15',
			'16',
			'17',
			'18',
			'19',
			'20',
			'21',
			'22',
			'23'
		],
		datasets: chat.getAuthors().map((a, idx) => {
			return {
				label: chat.authorNameMap[a] || a,
				backgroundColor: chatColors[idx % chatColors.length],
				borderColor: chatColors[idx % chatColors.length],
				data: chat.getHourlyData(a)
			};
		})
	});

	$effect(() => {
		chartData;
		if (chart) {
			chart.data = chartData;
			chart.update();
		}
	});

	onMount(() => {
		chart = new Chart(canvas, {
			type: 'bar',
			data: chartData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom',
						display: true
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						}
					},
					y: {
						title: {
							display: true,
							text: 'Messages'
						},
						beginAtZero: true,
						min: 0
					}
				}
			}
		});
	});
</script>

<h3 class="text-2xl font-thin mx-auto text-center">Messages per hour</h3>
<div class="min-h-[480px] p-4">
	<canvas bind:this={canvas}></canvas>
</div>
