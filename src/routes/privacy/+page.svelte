<script>
	import ArrowRightIcon from "$lib/assets/arrowRightIcon.svelte";
	import { m } from "$lib/paraglide/messages";
</script>

<div class="bg-stone-30">
	<div class="container max-w-[1236px] pt-[29px] pb-[100px]">
		<div
			class="justify-start text-orange-500 text-base font-normal font-['GT_Eesti_Pro_Display'] flex items-center gap-[6px] mb-[30px]"
		>
			<a href="/">{m.Main()}</a>
			<ArrowRightIcon />
			<a href="/privacy">{m.Privacy_Policy()}</a>
		</div>

		<div
			class="text-stone-900 text-7xl font-bold font-['GT_Eesti_Pro_Display'] leading-[63px] mb-[40px]"
		>
			{m.Privacy_Policy()}
		</div>

		<div
			class="self-stretch justify-start text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
		>
			{@html m.privacy_policy_text()}
		</div>
	</div>
</div>
