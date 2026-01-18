<script lang="ts">
	import { api } from "$lib";
	import { m } from "$lib/paraglide/messages";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import ArrowLeftIcon from "$lib/assets/arrowLeftIcon.svelte";
	import ArrowRightIcon from "$lib/assets/arrowRightIcon.svelte";
	import EditIcon from "$lib/assets/editIcon.svelte";
	import FileIcon from "$lib/assets/fileIcon.svelte";
	import SearchIcon from "$lib/assets/searchIcon.svelte";
	import ShareIcon from "$lib/assets/shareIcon.svelte";
	import SuperArrowRight from "$lib/assets/SuperArrowRight.svelte";
	import Button from "$lib/components/Button.svelte";
	import DateField from "$lib/components/DateField.svelte";
	import ReasonSelector from "$lib/components/ReasonSelector.svelte";
	import type { Client } from "$lib/types";
	import type { AxiosError } from "axios";
	import { onMount } from "svelte";
	import toast from "svelte-french-toast";
	import { fade, fly, slide } from "svelte/transition";
	import image from "$lib/assets/images/bgs/image.png";
	import { useCalculateRequestMutation } from "$lib/hooks.svelte";
	import { goto } from "$app/navigation";
	import { localizeHref } from "$lib/paraglide/runtime";

	const { mainError, loading, errors, result, calculate } =
		useCalculateRequestMutation();
	const today = new Date();
	const dates = $state({
		hours: `${String(today.getHours()).padStart(2, "0")}:${String(
			today.getMinutes(),
		).padStart(2, "0")}`,
		days: String(today.getDate()).padStart(2, "0"),
		months: String(today.getMonth() + 1).padStart(2, "0"),
		years: String(today.getFullYear()),
	});

	const fields = $state({
		gender: "Male",
	});
</script>

<section
	class="min-h-[calc(100svh-80px)] flex items-start justify-center pt-[40px] px-4 bg-no-repeat bg-center bg-cover"
	style={`background-image: url(${image});`}
>
	<div class="flex flex-col items-center gap-[20px]">
		<div class="bg-stone-900/20 backdrop-blur-[10px] p-[40px] max-w-[500px]">
			<form
				class="bg-stone-300 p-[16px]"
				onsubmit={async (e) => {
					e.preventDefault();
					const [h, m] = dates.hours.split(":");
					await calculate({
						hour: h,
						minute: m,
						day: dates.days,
						month: dates.months,
						year: dates.years,
						gender: fields.gender,
					});
				}}
			>
				<div class="flex justify-between items-center mb-[16px]">
					<div
						class="w-96 justify-start text-stone-900 text-xl font-bold font-['GT_Eesti_Pro_Display']"
					>
						{m.calculator_personal_info()}
					</div>
					<Button hover c="">
						<EditIcon />
					</Button>
				</div>

				<div class="mb-[20px]">
					<ReasonSelector
						options={[m.male(), m.female()]}
						bind:selectedOption={fields.gender}
					/>
				</div>

				<div class="flex gap-[8px] items-center mb-[16px]">
					<DateField
						match="00:00"
						title={m.calculator_hour_title()}
						bind:value={dates.hours}
						required
					/>
					<DateField
						match="00"
						title={m.calculator_day_title()}
						bind:value={dates.days}
						required
					/>
					<DateField
						match="00"
						title={m.calculator_month_title()}
						bind:value={dates.months}
						required
					/>
					<DateField
						match="0000"
						title={m.calculator_year_title()}
						bind:value={dates.years}
						required
					/>
				</div>

				<div class="flex justify-center mb-[16px] gap-3">
					<Button
						disabled={$loading}
						type="submit"
						hover
						c="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full max-w-44 px-2.5 bg-orange-500 rounded-xl outline outline-1 outline-offset-[-1px] outline-orange-500 min-h-[47px]"
					>
						{#if $loading}
							Calculating...
						{:else}
							Calculate
						{/if}
					</Button>

					{#if $result}
						<Button
							onclick={() => {
								goto(
									localizeHref(
										"/calculator/create?" +
											new URLSearchParams({
												hour: dates.hours,
												day: dates.days,
												month: dates.months,
												year: dates.years,
												gender: fields.gender,
											}).toString(),
									),
								);
							}}
							hover
							c="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full max-w-44 px-2.5 bg-orange-500 rounded-xl outline outline-1 outline-offset-[-1px] outline-orange-500 min-h-[47px]"
						>
							Create client
						</Button>
					{/if}
				</div>

				{#if $mainError}
					<div
						transition:slide
						class="text-red-500 text-base font-normal font-['GT_Eesti_Pro_Display'] text-center mb-[16px]"
					>
						{$mainError}
					</div>
				{/if}

				<div class="flex justify-center gap-[20px]">
					<div
						class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
					>
						{m.calculator_share()}
					</div>

					<Button hover c=""><ShareIcon /></Button>
					<Button hover c="">
						<FileIcon />
					</Button>
				</div>
			</form>
		</div>

		{#if $result}
			<div class="flex gap-2">
				{#each Object.entries($result) as [key, value], idx (key)}
					<div
						in:slide|global={{ delay: 30 * idx }}
						class="mt-[20px] p-[16px] bg-stone-300"
					>
						<div
							class="text-stone-900 text-xl font-bold font-['GT_Eesti_Pro_Display'] mb-[8px]"
						>
							{value.ganzhi}
						</div>
						<div
							class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
						>
							{value.parsed}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
