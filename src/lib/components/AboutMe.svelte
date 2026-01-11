<script>
	import StarIcon from "$lib/assets/starIcon.svelte";
	import image1 from "$lib/assets/images/aboutme/image1.png";
	import image2 from "$lib/assets/images/aboutme/image2.png";
	import { m } from '$lib/paraglide/messages';
</script>

<div class="bg-stone-300 overflow-hidden" id="about-me">
	<div
		class="container px-[40px] py-[70px] grid grid-cols-2 gap-[20px] max-[900px]:grid-cols-1"
	>
		<div>
			<div
				class="flex gap-[30px] w-fit mb-[30px] pl-[30px] pr-[41px] rounded-tr-[500px] rounded-br-[500px] border-2 border-stone-900 min-h-[90px] items-center"
			>
				<span
					class="text-stone-900 text-2xl font-bold font-['GT_Eesti_Pro_Display']"
					>{m.about_me_label()}</span
				>
				<StarIcon />
			</div>

			<div
				class="text-stone-900 text-7xl font-bold font-['GT_Eesti_Pro_Display'] leading-[63px] mb-[40px] max-[600px]:text-5xl max-[600px]:leading-[45px] grid gap-1"
			>
				{m.about_me_inspiration()}
				<span class="text-orange-500">{m.every_day_label()}</span>
			</div>

			<div
				class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[20px] max-w-[533px]"
			>
				{m.about_me_description1()}
			</div>

			<div
				class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] max-w-[532px]"
			>
				{m.about_me_description2()}
			</div>
		</div>

		<div>
			<div class="w-[670px] h-[500px] relative">
				<enhanced:img
					class="w-[500px] h-[500px] left-[170px] top-0 absolute rounded-full"
					src={image2}
					alt={m.about_portrait_alt()}
				/>
				<enhanced:img
					class="h-[500px] left-0 top-0 absolute"
					src={image1}
					alt={m.about_background_alt()}
				/>
			</div>
		</div>
	</div>
</div>
