<script>
	import StarIcon from "$lib/assets/starIcon.svelte";
	import image3 from "$lib/assets/images/image 3.png";
	import { m } from '$lib/paraglide/messages';
</script>

<section
	id="about-master"
	class="pt-[100px] pb-[120px] px-[40px] grid grid-cols-[auto_1fr_auto] container max-[1200px]:grid-cols-2 max-[800px]:grid-cols-1 overflow-hidden"
>
	<div
		class="min-h-[90px] px-[20px] flex items-center gap-[10px] rounded-tr-[500px] rounded-br-[500px] border-2 border-stone-900 min-[800px]:hidden w-fit mb-[30px]"
	>
		<div
			class="justify-start text-stone-900 text-2xl font-bold font-['GT_Eesti_Pro_Display']"
		>
			{m.about_master_heading()}
		</div>
		<StarIcon />
	</div>

	<div
		class="relative w-[500px] h-96 max-[1200px]:w-full max-[800px]:mb-[100px]"
	>
		<enhanced:img
			class="absolute inset-0 h-full top-[25px] left-[25px] rounded-[10px] object-cover z-10 max-[1200px]:object-left max-[800px]:w-full"
			src={image3}
			alt=""
		/>
		<div
			class="absolute inset-0 rounded-[10px] border-[3px] border-orange-500"
		></div>
	</div>

	<div class="ml-[53px] max-[800px]:ml-0">
		<div
			class="text-stone-900 text-7xl font-bold font-['GT_Eesti_Pro_Display'] leading-[63px] grid gap-1 max-[600px]:text-5xl max-[600px]:leading-[45px]"
		>
			<span class="mb-1">{m.about_master_label()}</span>
			<span class="text-orange-500"> {m.master_name()} </span>
		</div>

		<div
			class="self-stretch justify-start text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] my-[28px]"
		>
			{m.about_master_intro()}
		</div>

			<div
				class="max-w-[487px] justify-start text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
			>
				{m.about_master_bio()}
			</div>
	</div>

	<div>
		<div
			class="min-h-[90px] px-[20px] flex items-center gap-[10px] rounded-tl-[500px] rounded-bl-[500px] border-2 border-stone-900 max-[1200px]:hidden"
		>
			<div
				class="justify-start text-stone-900 text-2xl font-bold font-['GT_Eesti_Pro_Display']"
			>
				{m.about_master_heading()}
			</div>
			<StarIcon />
		</div>
	</div>
</section>
