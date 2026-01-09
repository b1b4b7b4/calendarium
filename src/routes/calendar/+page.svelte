<script>
	import ArrowLeftIcon from "$lib/assets/arrowLeftIcon.svelte";
	import Button from "$lib/components/Button.svelte";
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4"
	style="background: url('bgs/image.png') no-repeat center/cover"
>
	<div
		class="bg-stone-900/20 backdrop-blur-[10px] p-[40px] w-full max-w-[1010px]"
	>
		<div class="bg-orange-500 p-[17px] rounded-2xl">
			<div class="grid grid-cols-2 bg-stone-300">
				<div>
					<div class=" flex items-center min-h-[70px] px-[16px] w-full">
						<Button hover c="mr-[6px] flex items-center">
							<ArrowLeftIcon />
						</Button>

						<div class="flex gap-[10px] w-full">
							<div
								class="px-2 bg-white rounded-xl min-h-[50px] flex flex-col justify-center"
							>
								<div
									class="text-orange-300 text-xs font-normal font-['GT_Eesti_Pro_Display']"
								>
									Время
								</div>
								<div
									class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
								>
									23:25
								</div>
							</div>

							<div
								class="px-2 bg-white rounded-xl min-h-[50px] flex flex-col justify-center"
							>
								<div
									class="text-orange-300 text-xs font-normal font-['GT_Eesti_Pro_Display']"
								>
									Дата
								</div>
								<div
									class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
								>
									12
								</div>
							</div>

							<div
								class="px-2 bg-white rounded-xl min-h-[50px] flex flex-col justify-center w-full"
							>
								<div
									class="text-orange-300 text-xs font-normal font-['GT_Eesti_Pro_Display']"
								>
									Месяц
								</div>
								<div
									class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] w-full"
								>
									Февраль
								</div>
							</div>

							<div
								class="px-2 bg-white rounded-xl min-h-[50px] flex flex-col justify-center"
							>
								<div
									class="text-orange-300 text-xs font-normal font-['GT_Eesti_Pro_Display']"
								>
									Год
								</div>
								<div
									class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
								>
									2026
								</div>
							</div>
						</div>

						<Button hover c="flex items-center rotate-180 ml-[6px]">
							<ArrowLeftIcon />
						</Button>
					</div>
				</div>
				<div></div>
			</div>
		</div>
	</div>
</section>
