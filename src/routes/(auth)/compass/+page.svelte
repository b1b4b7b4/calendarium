<script lang="ts">
	import { debounce, locationSuggestionApi, selectedMapCoords } from "$lib";
	import ArrowLeftIcon from "$lib/assets/arrowLeftIcon.svelte";
	import ImageIcon from "$lib/assets/imageIcon.svelte";
	import PointerIcon from "$lib/assets/pointerIcon.svelte";
	import SearchIcon from "$lib/assets/searchIcon.svelte";
	import Button from "$lib/components/Button.svelte";
	import Map from "$lib/components/Map.svelte";
	import Switcher from "$lib/components/Switcher.svelte";
	import type { PhotonFeature, PhotonFeatureCollection } from "$lib/types";
	import { clsx } from "clsx";
	import toast from "svelte-french-toast";
	import { fade, fly, slide } from "svelte/transition";

	const compassItems = [
		{ label: "Compass A", img: "compassA.png" },
		{ label: "Compass B", img: "compassB.png" },
		{ label: "Compass C", img: "compassC.png" },
	];
	let selectedCompass = $state(0);

	const settingsItems = $state([
		{
			label: "Setting 1",
			desc: "Description for setting 1",
			state: true,
		},
		{
			label: "Setting 2",
			desc: "Description for setting 2",
			state: false,
		},
		{
			label: "Setting 3",
			desc: "Description for setting 3",
			state: true,
		},
	]);

	let sidebarOpen = $state(true);

	let searchState = $state({
		query: "",
		results: [] as PhotonFeature[],
		pending: true,
	});
</script>

<div class="w-full flex">
	{#if !sidebarOpen}
		<div
			transition:fly={{ x: -10, duration: 300 }}
			class="fixed left-0 top-[200px] z-1000"
		>
			<Button
				onclick={() => (sidebarOpen = true)}
				hover
				c="w-12 h-12 bg-orange-500 rounded-tr-[10px] rounded-br-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.10)] flex items-center justify-center"
			>
				<div class="rotate-180 text-white">
					<ArrowLeftIcon />
				</div>
			</Button>
		</div>
	{:else}
		<div
			in:fly={{ x: -300, duration: 300 }}
			out:fly={{ x: -300, duration: 300 }}
			class="min-h-[calc(100svh-100px)] bg-stone-300 rounded-tr-[10px] rounded-br-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.10)] min-w-[400px] z-50"
		>
			<div class="p-[20px]">
				<div
					class="text-orange-500 text-xl font-bold font-['GT_Eesti_Pro_Display'] mb-[20px] flex justify-between items-center"
				>
					Compass

					<Button hover onclick={() => (sidebarOpen = false)} c="">
						<ArrowLeftIcon />
					</Button>
				</div>

				<label
					class="focus-within:ring-2 ring-orange-500 w-full min-h-12 px-3.5 py-2 bg-white rounded-[10px] flex items-center gap-[10px]"
				>
					<Button hover c="">
						<PointerIcon />
					</Button>
					<input
						type="text"
						placeholder="Search"
						class="placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] ring-0 border-0 outline-0 bg-transparent w-full p-0 m-0"
						bind:value={searchState.query}
						oninput={debounce(async () => {
							try {
								searchState.pending = true;
								const res = await locationSuggestionApi({
									params: {
										q: searchState.query,
									},
								});
								await new Promise((r) => setTimeout(r, 1000));
								searchState.results = res.data.features;
							} catch (e) {
								toast.error("Error fetching location suggestions");
								searchState.results = [];
							} finally {
								searchState.pending = false;
							}
						}, 300)}
					/>

					<Button hover c="">
						<SearchIcon />
					</Button>
				</label>
			</div>

			<div class="w-full h-[1px] bg-stone-50"></div>

			{#if !searchState.query}
				<div in:slide={{ duration: 300 }} out:slide={{ duration: 200 }}>
					<div class="p-[20px]">
						<div
							class="text-orange-500 text-xl font-bold font-['GT_Eesti_Pro_Display'] mb-[20px]"
						>
							Settings
						</div>

						<div class="grid gap-[10px]">
							{#each settingsItems as item}
								<label class="flex justify-between items-center cursor-pointer">
									<div>
										<div
											class="self-stretch justify-start text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
										>
											{item.label}
										</div>
										<div
											class="self-stretch justify-start text-orange-300 text-sm font-normal font-['GT_Eesti_Pro_Display']"
										>
											{item.desc}
										</div>
									</div>

									<Switcher bind:active={item.state} />
								</label>
							{/each}
						</div>
					</div>

					<div class="w-full h-[1px] bg-stone-50"></div>

					<div class="p-[20px]">
						<div
							class="text-orange-500 text-xl font-bold font-['GT_Eesti_Pro_Display'] mb-[20px]"
						>
							Choose a compass
						</div>

						<div class="flex gap-[10px]">
							{#each compassItems as item, idx}
								<Button
									onclick={() => (selectedCompass = idx)}
									hover
									c={clsx(
										"w-28 h-28 relative rounded-xl  overflow-hidden p-1",
										selectedCompass === idx && "ring ring-2 ring-orange-500",
									)}
								>
									<img
										class="w-full h-full left-[4px] rounded-xl pointer-events-none"
										src="https://placehold.co/106x106"
										alt={item.label}
									/>
								</Button>
							{/each}
						</div>
					</div>

					<div class="w-full h-[1px] bg-stone-50"></div>

					<div class="flex justify-center py-[20px]">
						<Button
							hover
							c="px-5 py-2.5 bg-orange-500 rounded-[43px] w-fit text-orange-100 text-base font-normal font-['GT_Eesti_Pro_Display'] flex items-center gap-[10px]"
						>
							<ImageIcon />
							Add a photo
						</Button>
					</div>
				</div>
			{:else}
				<div
					in:slide={{ duration: 300 }}
					out:slide={{ duration: 200 }}
					class="p-[20px] overflow-auto max-h-[calc(100svh-250px)]"
				>
					<div
						class="text-orange-500 text-xl font-bold font-['GT_Eesti_Pro_Display'] mb-[20px]"
					>
						Search Results
					</div>

					{#if searchState.pending}
						{#each Array(10) as _, idx (idx)}
							<div
								in:fade|global={{ duration: 100, delay: idx * 30 }}
								out:slide|global={{ duration: 100 }}
							>
								<Button
									hover
									c="flex items-center gap-[14px] text-left w-full py-[10px]"
								>
									<div>
										<div
											class="bg-stone-400 animate-pulse w-6 h-6 rounded"
										></div>
									</div>
									<div class="w-full flex justify-between items-center">
										<div
											class="bg-stone-400 animate-pulse w-30 w-6 h-7 rounded"
										></div>
										<div
											class="bg-stone-400 animate-pulse w-6 h-4 rounded"
										></div>
									</div>
								</Button>
							</div>
						{/each}
					{:else if searchState.results.length === 0}
						<div
							class="text-stone-900 text
-base font-normal font-['GT_Eesti_Pro_Display']"
						>
							No results found.
						</div>
					{:else}
						{#each searchState.results as result, idx (idx)}
							<div in:fade|global={{ duration: 100, delay: idx * 33 }}>
								<Button
									onclick={() => {
										selectedMapCoords.set({
											lat: result.geometry.coordinates[1],
											lon: result.geometry.coordinates[0],
										});
									}}
									hover
									c="flex items-center gap-[14px] text-left w-full py-[10px]"
								>
									<div>
										<SearchIcon c="text-orange-500" />
									</div>
									<div class="w-full">
										<div
											class="text-orange-500 text-sm font-normal font-['GT_Eesti_Pro_Display'] line-clamp-1 max-w-[300px]"
										>
											{result.properties.street ?? result.properties.city}
										</div>
										<div
											class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] flex justify-between items-center"
										>
											<span class="max-w-[280px] line-clamp-2"
												>{result.properties.name}</span
											>
											<div
												class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
											>
												{result.properties.osm_key}
											</div>
										</div>
									</div>
								</Button>
							</div>
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<div class="flex-1 w-full h-[calc(100svh-100px)]">
		<Map />
	</div>
</div>
