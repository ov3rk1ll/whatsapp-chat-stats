<script lang="ts">
	import type { WordCount } from '$lib/chat.svelte';

	const { words, textClass = 'text-8xl sm:text-8xl' }: { words: WordCount[]; textClass?: string } =
		$props();
</script>

<div class="flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
	<div class="grid grid-cols-3 items-end gap-2 sm:gap-4 max-w-4xl w-full">
		<div
			class="relative flex flex-col items-center justify-end bg-gray-400 h-[250px] sm:h-[300px] rounded-t-lg shadow-xl order-1"
		>
			<span
				class="absolute top-[-30px] sm:-top-10 text-6xl sm:text-7xl font-extrabold text-gray-600"
				>2</span
			>
			<div class="flex flex-col items-center justify-center w-full p-2 sm:p-4 text-center">
				<div class="{textClass} font-bold text-white leading-none">
					{words.at(1)?.word}
				</div>
				<div class="text-xs sm:text-lg text-gray-200 mt-1">{words.at(1)?.count}</div>
			</div>
			<div
				class="bg-gray-500 w-full text-center text-sm sm:text-lg font-bold text-white p-2 rounded-t-lg"
			>
				2nd Place
			</div>
		</div>

		<div
			class="relative flex flex-col items-center justify-end bg-yellow-500 h-[300px] sm:h-[350px] rounded-t-lg shadow-2xl z-10 order-2"
		>
			<span
				class="absolute top-[-30px] sm:-top-10 text-6xl sm:text-7xl font-extrabold text-yellow-700"
				>1</span
			>
			<div class="flex flex-col items-center justify-center w-full p-2 sm:p-4 text-center">
				<div class="{textClass} font-bold text-white leading-none">
					{words.at(0)?.word}
				</div>
				<div class="text-sm sm:text-lg text-yellow-100 mt-1">{words.at(0)?.count}</div>
			</div>
			<div
				class="bg-yellow-600 w-full text-center text-lg sm:text-xl font-bold text-white p-3 rounded-t-lg"
			>
				1st Place
			</div>
		</div>

		<div
			class="relative flex flex-col items-center justify-end bg-orange-700 h-[200px] sm:h-[250px] rounded-t-lg shadow-lg order-3"
		>
			<span
				class="absolute top-[-30px] sm:-top-10 text-6xl sm:text-7xl font-extrabold text-orange-900"
				>3</span
			>
			<div class="flex flex-col items-center justify-center w-full p-2 sm:p-4 text-center">
				<div class="{textClass} font-bold text-white leading-none">
					{words.at(2)?.word}
				</div>
				<div class="text-xs sm:text-lg text-orange-300 mt-1">{words.at(2)?.count}</div>
			</div>
			<div
				class="bg-orange-800 w-full text-center text-sm sm:text-lg font-bold text-white p-2 rounded-t-lg"
			>
				3rd Place
			</div>
		</div>
	</div>
</div>
