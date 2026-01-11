<script>
	import AppStoreIcon from "$lib/assets/appStoreIcon.svelte";
	import { m } from "$lib/paraglide/messages";
	import GooglePlayIcon from "$lib/assets/googlePlayIcon.svelte";
	import Button from "./Button.svelte";
	import iPhone16Pro from "$lib/assets/images/iPhone 16 Pro.png";
</script>

<section class="bg-orange-100">
	<div class="container pl-[114px] pb-[165px] relative overflow-hidden">
		<div class="z-1 max-[1060px]:mb-[60px]">
			<div
				class="text-neutral-900 text-5xl font-bold font-['GT_Eesti_Pro_Display'] mb-[76px] mt-[93px] max-w-[500px] max-[800px]:text-4xl max-[800px]:mb-[40px]"
			>
				{m.app_description_title()}
			</div>
			<div
				class="opacity-60 text-neutral-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[40px] max-w-[600px] max-[1200px]:max-w-[400px]"
			>
				{m.app_description_text()}
			</div>

			<div class="flex gap-[20px] max-[700px]:flex-wrap">
				<Button
					hover
					c="text-white text-lg font-semibold font-['GT_Eesti_Pro_Display'] px-7 min-h-[61px] bg-orange-500 rounded-[10px] flex items-center gap-[10px] text-nowrap"
				>
					<AppStoreIcon />
					{m.download_app_store()}
				</Button>

				<Button
					hover
					c="px-7 min-h-[61px] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-orange-500 text-orange-500 text-lg font-semibold font-['GT_Eesti_Pro_Display'] flex items-center gap-[10px] text-nowrap"
				>
					<GooglePlayIcon />
					{m.download_app_store()}
				</Button>
			</div>
		</div>

		<div
			class="absolute min-[1061px]:right-0 min-[1061px]:bottom-[53px] z-1 min-[1061px]:max-[1400px]:right-[-100px] max-[1061px]:relative"
		>
			<div
				class="absolute inset-0 bg-[radial-gradient(ellipse_156.30%_156.30%_at_50.00%_50.00%,_rgba(255,_119.33,_35,_0.21)_0%,_rgba(30,_19,_5,_0.21)_100%)] rounded-[30px] blur-[20px]"
			></div>
			<enhanced:img
				src={iPhone16Pro}
				class="pointer-events-none relative z-10"
				alt=""
			/>
		</div>
	</div>
</section>
