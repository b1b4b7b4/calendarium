<script>
	import ArrowIcon from "$lib/assets/ArrowIcon.svelte";
	import EarthIcon from "$lib/assets/EarthIcon.svelte";
	import StarIcon from "$lib/assets/starIcon.svelte";
	import Button from "./Button.svelte";
	import { m } from "$lib/paraglide/messages";
</script>

<section class="bg-stone-300 mb-[75px]" id="bazi-basics">
	<div
		class="container px-[40px] py-[100px] flex gap-[120px] max-[900px]:flex-col"
	>
		<div class="max-w-[294px] max-[900px]:max-w-full">
			<div
				class="min-h-24 rounded-tr-[500px] rounded-br-[500px] border-2 border-stone-900 flex items-center gap-[10px] justify-between pl-[20px] pr-[30px] mb-[186px] max-[900px]:mb-[30px] max-[900px]:w-fit"
			>
				<span
					class="text-stone-900 text-2xl font-bold font-['GT_Eesti_Pro_Display']"
				>
					{m.bazi_basics_heading()}
				</span>
				<StarIcon />
			</div>

			<iframe
				class="rounded-[20px] w-full min-[900px]:hidden max-[900px]:mb-[30px]"
				height="531"
				src="https://www.youtube.com/embed/dQw4w9WgXcQ"
				title={m.bazi_video_alt()}
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>

			<div
				class="w-72 h-0 outline outline-1 outline-offset-[-0.50px] outline-white"
			></div>

			<div class="flex gap-[10px] pt-[30px] mb-[10px]">
				<Button
					hover
					c="text-orange-500 text-base font-normal font-['GT_Eesti_Pro_Display'] bg-orange-100 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-orange-500 w-full min-h-[40px] flex items-center justify-center gap-[10px]"
				>
					<EarthIcon />
					<span>{m.website_url()}</span>
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
					<span>{m.website_url()}</span>
				</Button>
				<Button
					hover
					c="bg-orange-100 rounded-[30px] outline outline-1 outline-offset-[-1px] outline-orange-500 min-w-[40px] min-h-[40px] flex items-center justify-center"
					><ArrowIcon /></Button
				>
			</div>
		</div>

		<iframe
			class="rounded-[20px] w-full max-[900px]:hidden"
			height="531"
			src="https://www.youtube.com/embed/dQw4w9WgXcQ"
			title={m.bazi_video_alt()}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowfullscreen
		></iframe>
	</div>
</section>
