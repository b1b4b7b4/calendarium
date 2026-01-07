<script>
	import StarIcon from "$lib/assets/starIcon.svelte";
</script>

<section
	class="pt-[100px] pb-[120px] px-[40px] grid grid-cols-[auto_1fr_auto] container"
>
	<div class="relative w-[500px] h-96">
		<img
			class="absolute inset-0 h-full top-[25px] left-[25px] rounded-[10px] object-cover z-10"
			src="/image 3.png"
			alt=""
		/>
		<div
			class="absolute inset-0 rounded-[10px] border-[3px] border-orange-500"
		></div>
	</div>

	<div class="ml-[53px]">
		<div
			class="text-stone-900 text-7xl font-bold font-['GT_Eesti_Pro_Display'] leading-[63px] grid gap-1"
		>
			<span class="mb-1">About Master</span>
			<span class="text-orange-500"> Benson Yeo </span>
		</div>

		<div
			class="self-stretch justify-start text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] my-[28px]"
		>
			Allow me to share my story with you and here is how it goes.
		</div>

		<div
			class="max-w-[487px] justify-start text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
		>
			In my past decade, I had been in pursue of learning my destiny or I should
			said, searching for a meaning in life! It started with bad luck, bad luck
			and bad luck! I was ambition in doing business but I lost all my saving
			and investment for trusting others and the only person to blame is myself
			but trust me, it is a lesson worth learning!
		</div>
	</div>

	<div>
		<div
			class="min-h-[90px] px-[20px] flex items-center gap-[10px] rounded-tl-[500px] rounded-bl-[500px] border-2 border-stone-900"
		>
			<div
				class="justify-start text-stone-900 text-2xl font-bold font-['GT_Eesti_Pro_Display']"
			>
				About the master
			</div>
			<StarIcon />
		</div>
	</div>
</section>
