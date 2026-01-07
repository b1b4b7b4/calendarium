<script>
	import StarIcon from "$lib/assets/starIcon.svelte";
</script>

<div class="bg-stone-300">
	<div class="container px-[40px] py-[70px] grid grid-cols-2 gap-[20px]">
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
				class="text-stone-900 text-7xl font-bold font-['GT_Eesti_Pro_Display'] leading-[63px] mb-[40px]"
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
				<img
					class="w-[500px] h-[500px] left-[170px] top-0 absolute rounded-full"
					src="/aboutme/image2.png"
				/>
				<img
					class="h-[500px] left-0 top-0 absolute"
					src="/aboutme/image1.png"
				/>
			</div>
		</div>
	</div>
</div>
