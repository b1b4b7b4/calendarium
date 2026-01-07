<script>
	import Button from "./Button.svelte";
</script>

<section class="bg-stone-300">
	<div class="grid grid-cols-2">
		<img src="/consultation.png" alt="" class="w-full object-cover" />
		<div class="px-[60px] flex flex-col justify-center">
			<form
				onsubmit={(e) => {
					e.preventDefault();
				}}
			>
				<div
					class="text-stone-900 text-7xl font-bold font-['GT_Eesti_Pro_Display'] leading-[63px] mb-[50px]"
				>
					Consultation
				</div>

				{#snippet field(type = "", placeholder = "", readonly = false)}
					<input
						{type}
						{placeholder}
						{readonly}
						required
						class="px-5 py-[16px] bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:outline-orange-500"
					/>
				{/snippet}

				<div class="grid-cols-2 grid gap-[10px] mb-[10px]">
					<div>
						<div
							class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[6px]"
						>
							Name
						</div>
						{@render field("text", "Enter your name")}
					</div>
					<div>
						<div
							class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[6px]"
						>
							Email
						</div>
						{@render field("text", "Enter your email")}
					</div>
				</div>

				<div class="mb-[10px]">
					<div
						class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[6px]"
					>
						Сhoose the reason for the feedback
					</div>
					{@render field("text", "Сhoose the reason for the feedback", true)}
				</div>

				<div class="mb-[10px]">
					<div
						class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[6px]"
					>
						Description
					</div>
					<textarea
						placeholder="Describe your situation in detail"
						class=" px-5 py-[16px] bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:outline-orange-500 min-h-[133px]"
					></textarea>
				</div>

				<div class="flex justify-end">
					<Button
						hover
						c="text-orange-100 text-base font-normal font-['GT_Eesti_Pro_Display'] min-w-44 px-5 bg-orange-500 rounded-[43px] min-h-[39px]"
					>
						To send</Button
					>
				</div>
			</form>
		</div>
	</div>
</section>
