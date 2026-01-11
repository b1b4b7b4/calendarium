<script>
	import { m } from "$lib/paraglide/messages";
	import image from "$lib/assets/images/bgs/image.png";
</script>

<section
	id="hero"
	class="min-h-[calc(100svh-80px)] relative flex flex-col gap-8 items-center justify-center px-4 py-16 bg-no-repeat bg-cover bg-center"
	style={`background-image: url(${image})`}
>
	<div
		class="text-center justify-start text-orange-100 text-[160px] font-black font-['GT_Eesti_Pro_Display'] leading-[144px] max-[600px]:text-[80px] max-[600px]:leading-[72px]"
	>
		{@html m.hero_title().replace("\n", "<br />")}
	</div>

	<div
		class="w-96 h-14 text-center justify-start text-orange-100 text-base font-normal font-['GT_Eesti_Pro_Display']"
	>
		{m.hero_description()}
	</div>
</section>
