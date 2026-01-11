<script>
	import StarIcon from "$lib/assets/starIcon.svelte";
	import image1 from "$lib/assets/images/aboutme/image1.png";
	import image2 from "$lib/assets/images/aboutme/image2.png";
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
					>ABOUT ME</span
				>
				<StarIcon />
			</div>

			<div
				class="text-stone-900 text-7xl font-bold font-['GT_Eesti_Pro_Display'] leading-[63px] mb-[40px] max-[600px]:text-5xl max-[600px]:leading-[45px] grid gap-1"
			>
				Something that inspires me
				<span class="text-orange-500">every day</span>
			</div>

			<div
				class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[20px] max-w-[533px]"
			>
				A vibrant city filled with cultural diversity and endless opportunities.
				From stunning architecture to cozy local cafes, it’s a place where
				tradition meets modernity.
			</div>

			<div
				class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] max-w-[532px]"
			>
				A vibrant city filled with cultural diversity and endless opportunities.
				From stunning architecture to cozy local cafes, it’s a place where
				tradition meets modernity. Perfect for travelers seeking unique
				experiences and unforgettable memories.
			</div>
		</div>

		<div>
			<div class="w-[670px] h-[500px] relative">
				<enhanced:img
					class="w-[500px] h-[500px] left-[170px] top-0 absolute rounded-full"
					src={image2}
					alt="Portrait of Benson Yeo"
				/>
				<enhanced:img
					class="h-[500px] left-0 top-0 absolute"
					src={image1}
					alt="About me background"
				/>
			</div>
		</div>
	</div>
</div>
