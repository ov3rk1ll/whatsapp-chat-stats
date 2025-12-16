<script lang="ts">
	import {
		Chart,
		LineController,
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		TimeScale,
		Tooltip,
		Filler
	} from 'chart.js';
	import 'chartjs-adapter-moment';
	import { onMount } from 'svelte';

	const { data }: { data: Record<string, number> } = $props();

	Chart.register(
		LineController,
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		TimeScale,
		Tooltip,
		Filler
	);

	let canvas: HTMLCanvasElement;

	const labels = $derived(Object.keys(data));
	const values = $derived(Object.values(data));
	const chartData = $derived({
		labels: labels,
		datasets: [
			{
				data: values,
				borderWidth: 1,
				lineTension: 0,
				pointRadius: 0,
				pointHitRadius: 2,
				fill: true,
				backgroundColor: '#EF5350',
				borderColor: '#B71C1C'
			}
		]
	});

	onMount(() => {
		new Chart(canvas, {
			type: 'line',
			data: chartData,
			options: {
				// pointHitRadius: 2,
				responsive: true,
				maintainAspectRatio: false,
				// lineTension: 0,
				plugins: {
					legend: {
						position: 'bottom',
						display: false
					}
				},
				scales: {
					x: {
						type: 'time',
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
						/*scaleLabel: {
							display: true,
							labelString: 'Messages'
						},
						ticks: {
							// precision: 0,
							// beginAtZero: true
						}*/
					}
				},
				elements: {
					line: {
						tension: 0
					}
				}
			}
		});
	});
</script>

<h3 class="text-2xl font-thin mx-auto text-center">Messages per day</h3>
<div class="min-h-[480px]">
	<canvas bind:this={canvas}></canvas>
</div>
