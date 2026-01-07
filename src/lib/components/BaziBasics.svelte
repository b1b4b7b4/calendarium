<script>
	import ArrowIcon from "$lib/assets/ArrowIcon.svelte";
	import EarthIcon from "$lib/assets/EarthIcon.svelte";
	import StarIcon from "$lib/assets/starIcon.svelte";
	import Button from "./Button.svelte";
</script>

<section class="container px-[40px] py-[100px] flex gap-[120px]">
	<div class="max-w-[294px]">
		<div
			class="min-h-24 rounded-tr-[500px] rounded-br-[500px] border-2 border-stone-900 flex items-center gap-[10px] justify-between pl-[20px] pr-[30px] mb-[186px]"
		>
			<span
				class="text-stone-900 text-2xl font-bold font-['GT_Eesti_Pro_Display']"
			>
				Bazi basics
			</span>
			<StarIcon />
		</div>

		<div
			class="w-72 h-0 outline outline-1 outline-offset-[-0.50px] outline-white"
		></div>

		<div class="flex gap-[10px] pt-[30px] mb-[10px]">
			<Button
				hover
				c="text-orange-500 text-base font-normal font-['GT_Eesti_Pro_Display'] bg-orange-100 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-orange-500 w-full min-h-[40px] flex items-center justify-center gap-[10px]"
			>
				<EarthIcon />
				<span>www.website.com</span>
			</Button>
			<Button
				hover
				c="bg-orange-100 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-orange-500 min-w-[40px] min-h-[40px] flex items-center justify-center"
				><ArrowIcon /></Button
			>
		</div>
		<div class="flex gap-[10px]">
			<Button
				hover
				c="text-orange-500 text-base font-normal font-['GT_Eesti_Pro_Display'] bg-orange-100 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-orange-500 w-full min-h-[40px] flex items-center justify-center gap-[10px]"
			>
				<EarthIcon />
				<span>www.website.com</span>
			</Button>
			<Button
				hover
				c="bg-orange-100 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-orange-500 min-w-[40px] min-h-[40px] flex items-center justify-center"
				><ArrowIcon /></Button
			>
		</div>
	</div>

	<div>
		<img class="rounded-[20px]" src="https://placehold.co/946x500" />
	</div>
</section>
