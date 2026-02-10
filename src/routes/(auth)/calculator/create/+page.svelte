<script lang="ts">
	import { api, genders } from "$lib";
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
	import { fade, fly, slide } from "svelte/transition";
	import CalculatorField from "$lib/components/calculatorField.svelte";
	import { useCreateClientMutation } from "$lib/hooks.svelte";
	import { page } from "$app/state";

	const { loading, errors, createClient, mainError } =
		useCreateClientMutation();

	const fields = $state({
		name: "",
		email: "",
		phone_number: "",
		address: "",
		country: "",
		remark: "",
		gender: parseInt(page.url.searchParams.get("gender") ?? "1"),
	});

	const dates = $state({
		hours: page.url.searchParams.get("hour") || "",
		days: page.url.searchParams.get("day") || "",
		months: page.url.searchParams.get("month") || "",
		years: page.url.searchParams.get("year") || "",
	});
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
				const [hour, minute] = dates.hours.split(":");
				await createClient({
					...fields,
					gender: fields.gender == 1 ? "male" : "female",
					date_of_birth: new Date(
						Number(dates.years),
						Number(dates.months) - 1,
						Number(dates.days),
						Number(hour),
						Number(minute),
					),
				});
			}}
		>
			<div class="flex justify-between items-center mb-[16px]">
				<div
					class="w-96 justify-start text-stone-900 text-xl font-bold font-['GT_Eesti_Pro_Display']"
				>
					{m.calculator_personal_info()}
				</div>
				<!-- <Button hover c=""> -->
				<!-- 	<EditIcon /> -->
				<!-- </Button> -->
			</div>

			<div class="mb-[20px]">
				<ReasonSelector
					options={genders}
					bind:selectedOptionId={fields.gender}
					selectedOptionReason={genders.find((x) => x.id === fields.gender)
						?.reason}
				/>
			</div>

			<div class="flex gap-[8px] items-center mb-[16px]">
				<DateField
					match="00:00"
					title={m.hour_title()}
					bind:value={dates.hours}
					required
				/>
				<DateField
					match="00"
					title={m.day_title()}
					bind:value={dates.days}
					required
				/>
				<DateField
					match="00"
					title={m.month_title()}
					bind:value={dates.months}
					required
				/>
				<DateField
					match="0000"
					title={m.year_title()}
					bind:value={dates.years}
					required
				/>
			</div>

			<CalculatorField
				type="text"
				bind:value={fields.name}
				placeholder={m.name_placeholder()}
				error={$errors.name}
				required
			/>

			<CalculatorField
				type="email"
				bind:value={fields.email}
				placeholder={m.create_email_placeholder()}
				error={$errors.email}
				required
			/>

			<CalculatorField
				type="text"
				bind:value={fields.phone_number}
				placeholder={m.create_phone_placeholder()}
				error={$errors.phone_number}
				required
				mask={{ mask: "+00000000000", lazy: true }}
			/>

			<CalculatorField
				type="text"
				bind:value={fields.address}
				placeholder={m.create_address_placeholder()}
				error={$errors.address}
				required
			/>

			<CalculatorField
				type="text"
				bind:value={fields.country}
				placeholder={m.create_country_placeholder()}
				error={$errors.country}
				required
			/>

			<CalculatorField
				type="text"
				bind:value={fields.remark}
				placeholder={m.create_remarks_placeholder()}
				error={$errors.remark}
				required
			/>

			<div class="flex justify-center mb-[16px]">
				<Button
					disabled={$loading}
					type="submit"
					hover
					c="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full max-w-44 px-2.5 bg-orange-500 rounded-xl outline outline-1 outline-offset-[-1px] outline-orange-500 min-h-[47px]"
				>
					{#if $loading}
						{m.calculator_saving()}
					{:else}
						{m.calculator_save()}
					{/if}
				</Button>
			</div>

			{#if $mainError}
				<div
					transition:slide
					class="text-red-500 text-base font-normal font-['GT_Eesti_Pro_Display'] text-center mb-[16px]"
				>
					{$mainError}
				</div>
			{/if}
		</form>
	</div>
</section>
