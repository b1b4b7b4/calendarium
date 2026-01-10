<script lang="ts">
	import { api } from "$lib";
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
	import { imask } from "@imask/svelte";
	import type { AxiosError } from "axios";
	import { onMount } from "svelte";
	import toast from "svelte-french-toast";
	import { fade, fly, slide } from "svelte/transition";

	const calculatorStateInit = {
		date_of_birth: "",
		gender: "",
		name: "",
		country: "",
		email: "",
		phone: "",
		address: "",
		remarks: "",
	};

	let calculatorState = $state({
		pending: false,
		error: calculatorStateInit,
		mainError: "",
	});

	let gender = $state("male");
	const dates = $state({
		hours: "22:22",
		days: "12",
		months: "12",
		years: "2025",
	});

	const infoFields = $state({
		name: "",
		country: "",
		email: "",
		phone_number: "",
		address: "",
		remark: "",
	});

	async function createClientRequest(
		data: Partial<typeof calculatorStateInit>,
	) {
		try {
			calculatorState = {
				pending: true,
				mainError: "",
				error: calculatorStateInit,
			};
			const res = await api.post("/client", data);
			toast.success("Data saved successfully!");
		} catch (e: any) {
			if (e.response?.data?.error) {
				calculatorState.mainError = e.response.data.error;
			} else {
				calculatorState.error = e.response?.data;
			}
		} finally {
			calculatorState.pending = false;
		}
	}
</script>

<section
	class="min-h-[calc(100svh-80px)] flex items-start justify-center pt-[40px] px-4"
	style="background: url('/bgs/image.png') no-repeat center/cover"
>
	<div class="bg-stone-900/20 backdrop-blur-[10px] p-[40px] max-w-[500px]">
		<form
			class="bg-stone-300 p-[16px]"
			onsubmit={async (e) => {
				e.preventDefault();
				await createClientRequest({
					date_of_birth: `${dates.years}-${dates.months}-${dates.days}`,
					...infoFields,
					gender,
				});
			}}
		>
			<div class="flex justify-between items-center mb-[16px]">
				<div
					class="w-96 justify-start text-stone-900 text-xl font-bold font-['GT_Eesti_Pro_Display']"
				>
					Personal info:
				</div>
				<Button hover c="">
					<EditIcon />
				</Button>
			</div>

			<div class="mb-[20px]">
				<ReasonSelector options={["male", "female"]} selectedOption={gender} />
			</div>

			<div class="flex gap-[8px] items-center mb-[16px]">
				<DateField
					match="00:00"
					title="Hour"
					bind:value={dates.hours}
					required
				/>
				<DateField match="00" title="Day" bind:value={dates.days} required />
				<DateField
					match="00"
					title="Month"
					bind:value={dates.months}
					required
				/>
				<DateField
					match="0000"
					title="Year"
					bind:value={dates.years}
					required
				/>
			</div>

			<input
				type="text"
				bind:value={infoFields.name}
				class="min-h-12 px-[20px] bg-white rounded-xl mb-[16px] placeholder:text-stone-400 text-base font-normal font-['GT_Eesti_Pro_Display'] leading-4 border-0 outline-0 w-full ring-0 focus-within:ring-2 ring-orange-500"
				placeholder="Name"
				required
			/>

			<input
				type="text"
				bind:value={infoFields.email}
				class="min-h-12 px-[20px] bg-white rounded-xl mb-[16px] placeholder:text-stone-400 text-base font-normal font-['GT_Eesti_Pro_Display'] leading-4 border-0 outline-0 w-full ring-0 focus-within:ring-2 ring-orange-500"
				placeholder="Email"
				required
			/>
			<input
				type="text"
				use:imask={{ mask: "+00000000000", lazy: true }}
				bind:value={infoFields.phone_number}
				class="min-h-12 px-[20px] bg-white rounded-xl mb-[16px] placeholder:text-stone-400 text-base font-normal font-['GT_Eesti_Pro_Display'] leading-4 border-0 outline-0 w-full ring-0 focus-within:ring-2 ring-orange-500"
				placeholder="Phone"
				required
			/>
			<input
				type="text"
				bind:value={infoFields.address}
				class="min-h-12 px-[20px] bg-white rounded-xl mb-[16px] placeholder:text-stone-400 text-base font-normal font-['GT_Eesti_Pro_Display'] leading-4 border-0 outline-0 w-full ring-0 focus-within:ring-2 ring-orange-500"
				placeholder="Address"
				required
			/>

			<input
				type="text"
				bind:value={infoFields.country}
				class="min-h-12 px-[20px] bg-white rounded-xl mb-[16px] placeholder:text-stone-400 text-base font-normal font-['GT_Eesti_Pro_Display'] leading-4 border-0 outline-0 w-full ring-0 focus-within:ring-2 ring-orange-500"
				placeholder="Country"
				required
			/>

			<input
				type="text"
				bind:value={infoFields.remark}
				class="min-h-12 px-[20px] bg-white rounded-xl mb-[16px] placeholder:text-stone-400 text-base font-normal font-['GT_Eesti_Pro_Display'] leading-4 border-0 outline-0 w-full ring-0 focus-within:ring-2 ring-orange-500"
				placeholder="Remarks"
				required
			/>

			<div class="flex justify-center mb-[16px]">
				<Button
					disabled={calculatorState.pending}
					type="submit"
					hover
					c="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full max-w-44 px-2.5 bg-orange-500 rounded-xl outline outline-1 outline-offset-[-1px] outline-orange-500 min-h-[47px]"
				>
					{#if calculatorState.pending}
						Saving...
					{:else}
						Save
					{/if}
				</Button>
			</div>

			{#if calculatorState.mainError}
				<div
					in:fade
					class="text-red-500 text-base font-normal font-['GT_Eesti_Pro_Display'] text-center mb-[16px]"
				>
					{calculatorState.mainError}
				</div>
			{/if}

			<div class="flex justify-center gap-[20px]">
				<div
					class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
				>
					Share:
				</div>

				<Button hover c=""><ShareIcon /></Button>
				<Button hover c="">
					<FileIcon />
				</Button>
			</div>
		</form>
	</div>
</section>
