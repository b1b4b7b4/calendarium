<script lang="ts">
	import { api } from "$lib";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import ArrowLeftIcon from "$lib/assets/arrowLeftIcon.svelte";
	import ArrowRightIcon from "$lib/assets/arrowRightIcon.svelte";
	import SearchIcon from "$lib/assets/searchIcon.svelte";
	import SuperArrowRight from "$lib/assets/SuperArrowRight.svelte";
	import Button from "$lib/components/Button.svelte";
	import type { Client } from "$lib/types";
	import { onMount } from "svelte";
	import toast from "svelte-french-toast";
	import { fade, fly, slide } from "svelte/transition";

	let searchQuery = $state("");

	let clientsState = $state({
		clients: [] as Client[],
		loading: true,
	});
	let selectedClient: Client | null = $state(null);

	async function fetchClients() {
		const res = await api("/client");
		await new Promise((r) => setTimeout(r, 1000));
		clientsState.loading = false;
		if (res.status !== 200) {
			toast.error("Ошибка при загрузке данных клиента");
		} else {
			clientsState.clients = res.data;
		}
	}

	onMount(async () => {
		await fetchClients();
	});
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4"
	style="background: url('bgs/image.png') no-repeat center/cover"
>
	<div class="bg-stone-900/20 backdrop-blur-[10px] p-[40px] flex">
		<div
			class="w-full max-w-96 py-[20px] bg-stone-900 rounded-tl-[20px] rounded-tr-[20px] px-[16px] min-h-[358px]"
		>
			<div class="flex items-center gap-[10px] mb-[20px]">
				<label
					class="px-4 bg-stone-300 rounded-xl focus-within:ring-2 ring-orange-500 flex items-center gap-2 min-h-[50px]"
				>
					<SearchIcon />
					<input
						bind:value={searchQuery}
						type="text"
						class="ring-0 border-0 bg-transparent text-stone-950 text-base font-normal font-['GT_Eesti_Pro_Display'] p-0"
					/>
				</label>
				{#if searchQuery.length > 0}
					<div
						in:slide={{ duration: 250, axis: "x" }}
						out:slide={{ duration: 250, axis: "x" }}
					>
						<Button
							hover
							onclick={() => (searchQuery = "")}
							c="w-full justify-center text-white text-base font-medium font-['GT_Eesti_Pro_Display']"
							>Отмена</Button
						>
					</div>
				{/if}
			</div>

			{#if clientsState.loading}
				<div
					class="text-stone-300 text-base font-normal font-['GT_Eesti_Pro_Display'] text-center mt-2 grid gap-[10px]"
				>
					{#each Array(3) as _, idx (idx)}
						<div out:slide|global class="w-full">
							<Button
								hover
								c="border-b border-orange-100 py-[6px] flex items-center justify-between w-full text-left"
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
			{:else if clientsState.clients.length === 0}
				<div
					in:slide={{ duration: 500 }}
					class="text-stone-300 text-base font-normal font-['GT_Eesti_Pro_Display'] text-center mt-2"
				>
					Клиенты не найдены
				</div>
			{:else}
				<div class="grid gap-[10px]">
					{#each clientsState.clients as client, idx (idx)}
						{#if client.name.includes(searchQuery)}
							<div
								in:slide|global={{ delay: idx * 33 }}
								out:fade|global={{ duration: 100 }}
							>
								<Button
									onclick={() => (selectedClient = client)}
									hover
									c="border-b border-orange-100 py-[6px] flex items-center justify-between w-full text-left"
								>
									<div>
										<div
											class="text-orange-500 text-xs font-normal font-['GT_Eesti_Pro_Display'] mb-[3px]"
										>
											{new Date(client.date_of_birth).toLocaleDateString(
												"ru-RU",
											)}
										</div>
										<div
											class="text-stone-300 text-base font-normal font-['GT_Eesti_Pro_Display']"
										>
											{client.name}
										</div>
									</div>
									<div>
										<SuperArrowRight />
									</div>
								</Button>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>

		{#if selectedClient}
			<div
				transition:slide={{ axis: "x", duration: 300 }}
				class="min-w-[649px] p-[20px] bg-stone-900 rounded-t-[20px] mt-2"
			></div>
		{/if}
	</div>
</section>
