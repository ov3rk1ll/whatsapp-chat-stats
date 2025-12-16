<script lang="ts">
	import type { Chat } from '$lib/chat';
	import { chatColors, hexToRgbA } from '$lib/utils/colors';
	import { Chart, Filler, RadarController, RadialLinearScale } from 'chart.js';
	import 'chartjs-adapter-moment';
	import moment from 'moment';
	import { onMount } from 'svelte';

	const {
		chat,
		dataGrouping,
		title
	}: { chat: Chat; dataGrouping: 'monthly' | 'weekday'; title: string } = $props();

	Chart.register(RadarController, RadialLinearScale, Filler);

	let canvas: HTMLCanvasElement;

	const chartData = $derived({
		labels: dataGrouping == 'monthly' ? moment.months() : moment.weekdays(),
		datasets: chat.getAuthors().map((a, idx) => {
			return {
				label: chat.authorNameMap[a] || a,
				fill: true,
				backgroundColor: hexToRgbA(chatColors[idx % chatColors.length]),
				borderColor: chatColors[idx % chatColors.length],
				data: dataGrouping == 'monthly' ? chat.getMonthlyData(a) : chat.getWeekdayData(a)
			};
		})
	});

	onMount(() => {
		new Chart(canvas, {
			type: 'radar',
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
				scales: { r: { beginAtZero: true, min: 0 } }
			}
		});
	});
</script>

<h3 class="text-2xl font-thin mx-auto text-center">{title}</h3>
<div class="min-h-[480px] p-4">
	<canvas bind:this={canvas}></canvas>
</div>
