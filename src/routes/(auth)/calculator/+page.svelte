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

	type BaziResponse = {
		year: {
			ganzhi: string;
			parsed: string;
		};
		month: {
			ganzhi: string;
			parsed: string;
		};
		day: {
			ganzhi: string;
			parsed: string;
		};
		hour: {
			ganzhi: string;
			parsed: string;
		};
	};

	const calculatorStateInit = {
		hour: "",
		day: "",
		month: "",
		year: "",
		gender: "",
	};

	let calculatorState = $state({
		pending: false,
		error: calculatorStateInit,
		mainError: "",
	});

	const today = new Date();

	let gender = $state(m.male());
	const dates = $state({
		hours:
			today.getHours().toString().padStart(2, "0") +
			":" +
			today.getMinutes().toString().padStart(2, "0"),
		days: today.getDate().toString(),
		months: (today.getMonth() + 1).toString(),
		years: today.getFullYear().toString(),
	});

	let bazi: Partial<BaziResponse> = $state({});

	async function calcuateRequest(
		data: Partial<typeof calculatorStateInit & { minute: string }>,
	) {
		try {
			calculatorState = {
				pending: true,
				mainError: "",
				error: calculatorStateInit,
			};
			const res = await api.post("/calculator", data);
			toast.success(m.calculator_save_success_toast());
			bazi = res.data.bazi;
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				calculatorState.mainError =
					e.response.data.error || e.response.data.detail;
			} else {
				calculatorState.error = e.response?.data;
			}
		} finally {
			calculatorState.pending = false;
		}
	}
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
					await calcuateRequest({
						hour: h,
						minute: m,
						day: dates.days,
						month: dates.months,
						year: dates.years,
						gender,
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
						selectedOption={gender}
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

				<div class="flex justify-center mb-[16px]">
					<Button
						disabled={calculatorState.pending}
						type="submit"
						hover
						c="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full max-w-44 px-2.5 bg-orange-500 rounded-xl outline outline-1 outline-offset-[-1px] outline-orange-500 min-h-[47px]"
					>
						{#if calculatorState.pending}
							{m.calculator_saving()}
						{:else}
							{m.calculator_save()}
						{/if}
					</Button>
				</div>

				{#if calculatorState.mainError}
					<div
						transition:slide
						class="text-red-500 text-base font-normal font-['GT_Eesti_Pro_Display'] text-center mb-[16px]"
					>
						{calculatorState.mainError}
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

		<div class="flex gap-2">
			{#each Object.entries(bazi) as [key, value], idx (key)}
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
	</div>
</section>
