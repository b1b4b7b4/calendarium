<script lang="ts">
	import {
		api,
		areYouSureContinue,
		areYouSureModalActive,
		areYouSureModalPending,
		debounce,
		genders,
	} from "$lib";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import ArrowLeftIcon from "$lib/assets/arrowLeftIcon.svelte";
	import ArrowRightIcon from "$lib/assets/arrowRightIcon.svelte";
	import SearchIcon from "$lib/assets/searchIcon.svelte";
	import SuperArrowRight from "$lib/assets/SuperArrowRight.svelte";
	import Button from "$lib/components/Button.svelte";
	import type { Client } from "$lib/types";
	import { onMount } from "svelte";
	import toast from "svelte-french-toast";
	import { m } from "$lib/paraglide/messages";
	import { fade, fly, slide } from "svelte/transition";
	import image from "$lib/assets/images/bgs/image.png";
	import { LucideAlignEndVertical } from "@lucide/svelte";
	import EditIcon from "$lib/assets/editIcon.svelte";
	import BinIcon from "$lib/assets/BinIcon.svelte";
	import { useClientsQuery, useUpdateClientMutation } from "$lib/hooks.svelte";
	import BaziBlock from "$lib/components/BaziBlock.svelte";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import ReasonSelector from "$lib/components/ReasonSelector.svelte";
	import DateField from "$lib/components/DateField.svelte";
	import CalculatorField from "$lib/components/calculatorField.svelte";
	import { writable } from "svelte/store";

	const {
		clients,
		fetchClients,
		mainError,
		loading,
		searchQuery,
		selectedClient,
	} = useClientsQuery();

	let { years, months, days, hours } = $derived.by(() => {
		const d = new Date($selectedClient?.date_of_birth ?? new Date());
		return {
			years: d.getFullYear(),
			months: d.getMonth() + 1,
			days: d.getDate(),
			hours: `${String(d.getHours()).padStart(2, "0")}:${String(
				d.getMinutes(),
			).padStart(2, "0")}`,
		};
	});

	const searchParams = $derived(
		Object.fromEntries(page.url.searchParams.entries()),
	);
	const hasAttachParams = $derived(
		page.url.searchParams.has("hour") &&
			page.url.searchParams.has("year") &&
			page.url.searchParams.has("month") &&
			page.url.searchParams.has("day"),
	);

	const { updateClient, errors } = useUpdateClientMutation();

	let updateClientActive = writable(false);
	let updateClientPending = writable(false);

	const updateFields = $derived({
		name: $selectedClient?.name ?? "",
		email: $selectedClient?.email ?? "",
		phone_number: $selectedClient?.phone_number ?? "",
		address: $selectedClient?.address ?? "",
		country: $selectedClient?.country ?? "",
		remark: $selectedClient?.remark ?? "",
		gender: parseInt($selectedClient?.gender == "male" ? "1" : "2"),
	});

	const updateDates = $derived({
		hours: String(hours),
		days: String(days),
		months: String(months),
		years: String(years),
	});
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4 bg-no-repeat bg-center bg-cover"
	style={`background-image: url(${image});`}
>
	<div class="bg-stone-900/20 backdrop-blur-[10px] p-[40px] flex gap-[17px]">
		<div class="bg-stone-900 flex flex-col">
			<div
				class="w-[390px] min-h-[558px] py-[20px] rounded-tl-[20px] rounded-tr-[20px] px-[16px] min-h-[358px]"
			>
				<div class="flex items-center gap-[10px] mb-[20px]">
					<label
						class="px-4 bg-stone-300 rounded-xl focus-within:ring-2 ring-orange-500 flex items-center gap-2 min-h-[50px] w-full"
					>
						<SearchIcon />
						<input
							type="text"
							value={$searchQuery}
							class="ring-0 border-0 bg-transparent text-stone-950 text-base font-normal font-['GT_Eesti_Pro_Display'] p-0"
							oninput={debounce(
								(e: any) => searchQuery.set(e.target.value),
								500,
							)}
						/>
					</label>
					{#if $searchQuery.length > 0}
						<div transition:slide={{ duration: 250, axis: "x" }}>
							<Button
								hover
								onclick={() => searchQuery.set("")}
								c="w-full justify-center text-white text-base font-medium font-['GT_Eesti_Pro_Display']"
								>{m.cancel_button()}</Button
							>
						</div>
					{/if}
				</div>

				{#if $loading}
					<div
						class="text-stone-300 text-base font-normal font-['GT_Eesti_Pro_Display'] text-center mt-2 grid gap-[10px]"
					>
						{#each Array(5) as _, idx (idx)}
							<div
								in:slide|global={{ duration: 200, delay: 20 * idx }}
								class="w-full"
							>
								<Button
									hover
									c="border-b border-orange-100 py-[6px] flex items-center justify-between w-full text-left  min-h-[57px]"
								>
									<div class="min-w-[50%]">
										<div
											class="text-orange-500 text-xs font-normal font-['GT_Eesti_Pro_Display'] mb-[3px]"
										>
											<div
												class="bg-stone-300 opacity-10 animate-pulse min-h-3 rounded"
											></div>
										</div>
									</div>
									<div>
										<div
											class="bg-stone-200 opacity-10 animate-pulse h-3 w-3 rounded"
										></div>
									</div>
								</Button>
							</div>
						{/each}
					</div>
				{:else if $clients.length === 0}
					<div
						in:slide={{ duration: 500 }}
						class="text-stone-300 text-base font-normal font-['GT_Eesti_Pro_Display'] text-center mt-2"
					>
						{m.clients_not_found()}
					</div>
				{:else}
					<div class="grid gap-[10px]">
						{#each $clients as client, idx (idx)}
							<div
								in:slide|global={{ delay: idx * 33 }}
								out:fade|global={{ duration: 100 }}
							>
								<Button
									onclick={() => selectedClient.set(client)}
									hover
									c="border-b border-orange-100 py-[6px] flex items-center justify-between w-full text-left"
								>
									<div>
										<div
											class="text-orange-500 text-xs font-normal font-['GT_Eesti_Pro_Display'] mb-[3px]"
										>
											{new Date(client.date_of_birth).toLocaleString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
												hour: "numeric",
												minute: "numeric",
											})}
										</div>
										<div
											class="text-stone-300 text-base font-normal font-['GT_Eesti_Pro_Display']"
										>
											{client.email}
										</div>
									</div>
									<div>
										<SuperArrowRight />
									</div>
								</Button>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			{#if hasAttachParams && $selectedClient}
				<div class="flex justify-center gap-[20px] my-10 mt-auto items-center">
					<Button
						onclick={() => {
							areYouSureContinue.set(async () => {
								const [hour, minute] = searchParams.hour.split(":");
								await updateClient({
									...$selectedClient,
									id: Number($selectedClient?.id),
									date_of_birth: new Date(
										Number(searchParams.year ?? "1970"),
										Number(searchParams.month ?? "1") - 1,
										Number(searchParams.day ?? "1"),
										Number(hour),
										Number(minute),
									),
								});
								await fetchClients();
								goto(page.url.pathname);
							});
							areYouSureModalActive.set(true);
						}}
						hover
						c="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full max-w-44 px-2.5 bg-orange-500 rounded-xl outline outline-1 outline-offset-[-1px] outline-orange-500 min-h-[47px]"
					>
						Attach to client
					</Button>
				</div>
			{/if}
		</div>

		{#if $selectedClient}
			<div
				transition:slide={{ axis: "x", duration: 300 }}
				class="min-w-[649px] p-[20px] bg-stone-900 rounded-t-[20px] mt-2"
			>
				<div class="px-4 py-2.5 bg-stone-300 h-full">
					<div class="grid grid-cols-[1fr_auto_1fr] mb-[10px]">
						<Button
							hover
							c="hover:text-orange-500"
							onclick={() => {
								updateClientActive.set(true);
							}}
						>
							<EditIcon />
						</Button>

						<div
							class="justify-start text-stone-900 text-xl font-normal font-['GT_Eesti_Pro_Display']"
						>
							{$selectedClient?.name}
						</div>

						<Button
							hover
							c="justify-self-end hover:text-red-500"
							onclick={() => {
								areYouSureModalActive.set(true);
								areYouSureContinue.set(async () => {
									await api.delete("/clients", {
										params: {
											id: $selectedClient?.id,
										},
									});
									await fetchClients();
								});
							}}
						>
							<BinIcon />
						</Button>
					</div>

					{#snippet RowBlock(label = "", value = "")}
						<div class="flex flex-col gap-[1px]">
							<div
								class="self-stretch justify-start text-orange-500 text-sm font-normal font-['GT_Eesti_Pro_Display']"
							>
								{label}
							</div>
							<div
								class="self-stretch justify-start text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
							>
								{value}
							</div>
						</div>
					{/snippet}

					{@render RowBlock(m.client_email_label(), $selectedClient?.email)}
					{@render RowBlock(
						m.client_date_of_birth_label(),
						new Date($selectedClient?.date_of_birth).toLocaleString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
						}),
					)}
					{@render RowBlock(
						m.client_phone_label(),
						$selectedClient?.phone_number,
					)}
					{@render RowBlock(m.client_address_label(), $selectedClient?.address)}
					{@render RowBlock(m.client_country_label(), $selectedClient?.country)}
					{@render RowBlock(m.client_remarks_label(), $selectedClient?.remark)}

					<div class=" mt-10">
						<BaziBlock {hours} {years} {months} {days} />
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

{#if $updateClientActive}
	<div
		onclick={() => {
			updateClientActive.set(false);
			updateClientPending.set(false);
		}}
		transition:fade={{ duration: 300 }}
		class="fixed inset-0 z-100 bg-black/30 backdrop-blur-blur"
	></div>
	<div
		transition:fade={{ duration: 300 }}
		class="fixed z-101 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-96 bg-orange-100 rounded-xl p-[20px] hide-body-scroll max-h-[80vh] overflow-y-auto hide-scrollbar"
	>
		<form
			in:fly={{ y: 10, opacity: 0, duration: 200, delay: 30 }}
			class="bg-stone-300 p-[16px]"
			onsubmit={async (e) => {
				e.preventDefault();
				const [hours, minutes] = updateDates.hours.split(":");
				updateClientPending.set(true);
				await updateClient({
					...updateFields,
					id: Number($selectedClient?.id),
					gender: updateFields.gender == 1 ? "male" : "female",
					date_of_birth: new Date(
						Number(updateDates.years),
						Number(updateDates.months) - 1,
						Number(updateDates.days),
						Number(hours),
						Number(minutes),
					),
				});
				await fetchClients();
				updateClientPending.set(false);
			}}
		>
			<div class="flex justify-between items-center mb-[16px]">
				<div
					class="w-96 justify-start text-stone-900 text-xl font-bold font-['GT_Eesti_Pro_Display']"
				>
					{m.calculator_personal_info()}
				</div>
			</div>

			<div class="mb-[20px]">
				<ReasonSelector
					options={genders}
					bind:selectedOptionId={updateFields.gender}
					selectedOptionReason={genders.find(
						(x) => x.id === updateFields.gender,
					)?.reason}
				/>

				{#if $errors.gender}
					<div
						transition:slide
						class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mt-1"
					>
						{$errors.gender}
					</div>
				{/if}
			</div>

			<div class="mb-[16px]">
				<div class="flex gap-[8px] items-center mb-1">
					<DateField
						match="00:00"
						title={m.hour_title()}
						bind:value={updateDates.hours}
						required
					/>
					<DateField
						match="00"
						title={m.day_title()}
						bind:value={updateDates.days}
						required
					/>
					<DateField
						match="00"
						title={m.month_title()}
						bind:value={updateDates.months}
						required
					/>
					<DateField
						match="0000"
						title={m.year_title()}
						bind:value={updateDates.years}
						required
					/>
				</div>
				{#if $errors.date_of_birth}
					<div
						transition:slide
						class="text-red-500 text-sm font-['GT_Eesti_Pro_Display']"
					>
						{$errors.date_of_birth}
					</div>
				{/if}
			</div>

			<CalculatorField
				type="text"
				bind:value={updateFields.name}
				placeholder={m.name_placeholder()}
				error={$errors.name}
				required
			/>

			<CalculatorField
				type="email"
				bind:value={updateFields.email}
				placeholder={m.create_email_placeholder()}
				error={$errors.email}
				required
			/>

			<CalculatorField
				type="text"
				bind:value={updateFields.phone_number}
				placeholder={m.create_phone_placeholder()}
				error={$errors.phone_number}
				required
				mask={{ mask: "+00000000000", lazy: true }}
			/>

			<CalculatorField
				type="text"
				bind:value={updateFields.address}
				placeholder={m.create_address_placeholder()}
				error={$errors.address}
				required
			/>

			<CalculatorField
				type="text"
				bind:value={updateFields.country}
				placeholder={m.create_country_placeholder()}
				error={$errors.country}
				required
			/>

			<CalculatorField
				type="text"
				bind:value={updateFields.remark}
				placeholder={m.create_remarks_placeholder()}
				error={$errors.remark}
				required
			/>

			<div class="flex justify-center mb-[16px]">
				<Button
					disabled={$updateClientPending}
					type="submit"
					hover
					c="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full max-w-44 px-2.5 bg-orange-500 rounded-xl outline outline-1 outline-offset-[-1px] outline-orange-500 min-h-[47px]"
				>
					{#if $updateClientPending}
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
{/if}
