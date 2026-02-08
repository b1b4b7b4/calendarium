<script lang="ts">
	import { calculateBazi, earthlyBranchMap, elementMap } from "$lib";

	let {
		hours = $bindable(null),
		days = $bindable(null),
		months = $bindable(null),
		years = $bindable(null),
		ref = $bindable(null),
	} = $props();

	const result: any = $derived.by(() => {
		const [hour, minute] = hours.split(":");
		return calculateBazi({
			year: Number(years),
			month: Number(months),
			day: Number(days),
			hour: Number(hour),
			minute: minute ? Number(minute) : 0,
		});
	});

	const items = ["hour", "day", "month", "year"];
</script>

{#snippet BaziBlock(
	a: any,
	b: any,
	c: any,
	d: any,
	src = "https://placehold.co/80x80",
)}
	<div class="border-[0.50px] border-orange-500 min-w-[120px]">
		<div
			class="px-4 py-2 flex justify-between border-b-[0.50px] border-orange-500"
		>
			<div
				class="justify-start text-stone-900 text-base font-medium font-['GT_Eesti_Pro_Display']"
			>
				{a}
			</div>
			<div
				class="justify-start text-stone-900 text-base font-medium font-['GT_Eesti_Pro_Display']"
			>
				{b}
			</div>
		</div>
		<div class="flex justify-between px-[8px] pt-[8px]">
			<div
				class="justify-start text-stone-900 text-[10px] font-medium font-['GT_Eesti_Pro_Display']"
			>
				{c}
			</div>
			<div
				class="justify-start text-stone-900 text-[10px] font-medium font-['GT_Eesti_Pro_Display']"
			>
				{d}
			</div>
		</div>
		<img class="w-20 h-20 m-auto mb-[8px]" {src} />
	</div>
{/snippet}

<div bind:this={ref} class="bg-white grid grid-cols-4">
	{#each items as time}
		{@render BaziBlock(
			result[time].ganzhi[0],
			time,
			"非",
			"非",
			elementMap[result[time].ganzhi[0]].icon,
		)}
	{/each}

	{#each ["hour", "day", "month", "year"] as time}
		{@render BaziBlock(
			result[time].ganzhi[1],
			"",
			"非",
			"非",
			earthlyBranchMap[result[time].ganzhi[1]].icon,
		)}
	{/each}
</div>
