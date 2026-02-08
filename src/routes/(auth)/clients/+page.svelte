<script lang="ts">
	import {
		api,
		areYouSureContinue,
		areYouSureModalActive,
		debounce,
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
	import { useClientsQuery } from "$lib/hooks.svelte";
	import BaziBlock from "$lib/components/BaziBlock.svelte";

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

	// let searchQuery = $state("");

	// let clientsState = $state({
	// 	clients: [] as Client[],
	// 	loading: true,
	// });
	// let selectedClient: Client | null = $state(null);

	// async function fetchClients() {
	// 	const res = await api("/clients");
	// 	await new Promise((r) => setTimeout(r, 1000));
	// 	clientsState.loading = false;
	// 	if (res.status !== 200) {
	// 		toast.error(m.clients_load_error_toast());
	// 	} else {
	// 		clientsState.clients = res.data;
	// 	}
	// }
	//
	// onMount(async () => {
	// 	await fetchClients();
	// });
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4 bg-no-repeat bg-center bg-cover"
	style={`background-image: url(${image});`}
>
	<div class="bg-stone-900/20 backdrop-blur-[10px] p-[40px] flex gap-[17px]">
		<div
			class="w-[390px] min-h-[558px] py-[20px] bg-stone-900 rounded-tl-[20px] rounded-tr-[20px] px-[16px] min-h-[358px]"
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
						oninput={debounce((e: any) => searchQuery.set(e.target.value), 500)}
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
										{new Date(client.date_of_birth).toLocaleDateString("ru-RU")}
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

		{#if $selectedClient}
			<div
				transition:slide={{ axis: "x", duration: 300 }}
				class="min-w-[649px] p-[20px] bg-stone-900 rounded-t-[20px] mt-2"
			>
				<div class="px-4 py-2.5 bg-stone-300 h-full">
					<div class="grid grid-cols-[1fr_auto_1fr] mb-[10px]">
						<Button hover c="">
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
						new Date($selectedClient?.date_of_birth).toLocaleDateString(
							"ru-RU",
						),
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
