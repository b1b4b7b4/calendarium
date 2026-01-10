<script>
	import AppStoreIcon from "$lib/assets/appStoreIcon.svelte";
	import GooglePlayIcon from "$lib/assets/googlePlayIcon.svelte";
	import Button from "./Button.svelte";
</script>

<section class="bg-orange-100">
	<div class="container pl-[114px] pb-[165px] relative">
		<div class="z-1">
			<div
				class="text-neutral-900 text-5xl font-bold font-['GT_Eesti_Pro_Display'] mb-[76px] mt-[93px]"
			>
				Ассистент для расчёта Ба-цзы, <br /> анализа энергии и жизненного
				<br />
				пути
			</div>
			<div
				class="opacity-60 text-neutral-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[40px]"
			>
				Откройте тайны своей судьбы и энергии с помощью приложения для расчёта
				Ба-цзы!<br />Наше приложение помогает глубже понять себя, выявить
				сильные и <br /> слабые стороны, а также гармонизировать вашу жизнь
				через древнюю
				<br />
				китайскую метафизику.
			</div>

			<div class="flex gap-[20px]">
				<Button
					hover
					c="text-white text-lg font-semibold font-['GT_Eesti_Pro_Display'] px-7 min-h-[61px] bg-orange-500 rounded-[10px] flex items-center gap-[10px]"
				>
					<AppStoreIcon />
					Скачать App store
				</Button>

				<Button
					hover
					c="px-7 min-h-[61px] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-orange-500 text-orange-500 text-lg font-semibold font-['GT_Eesti_Pro_Display'] flex items-center gap-[10px]"
				>
					<GooglePlayIcon />
					Скачать Google Play
				</Button>
			</div>
		</div>

		<div class="absolute right-0 bottom-[53px] z-1">
			<div
				class="absolute inset-0 bg-[radial-gradient(ellipse_156.30%_156.30%_at_50.00%_50.00%,_rgba(255,_119.33,_35,_0.21)_0%,_rgba(30,_19,_5,_0.21)_100%)] rounded-[30px] blur-[20px]"
			></div>
			<img
				src="/iPhone 16 Pro.png"
				class="pointer-events-none relative z-10"
				alt=""
			/>
		</div>
	</div>
</section>
