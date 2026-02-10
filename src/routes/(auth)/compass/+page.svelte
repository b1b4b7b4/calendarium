<script lang="ts">
	import {
		api,
		currentSession,
		debounce,
		locationSuggestionApi,
		selectedMapCoords,
	} from "$lib";
	import { m } from "$lib/paraglide/messages";
	import ArrowLeftIcon from "$lib/assets/arrowLeftIcon.svelte";
	import ImageIcon from "$lib/assets/imageIcon.svelte";
	import PointerIcon from "$lib/assets/pointerIcon.svelte";
	import SearchIcon from "$lib/assets/searchIcon.svelte";
	import Button from "$lib/components/Button.svelte";
	import Map from "$lib/components/Map.svelte";
	import Switcher from "$lib/components/Switcher.svelte";
	import { clsx } from "clsx";
	import toast from "svelte-french-toast";
	import { fade, fly, slide } from "svelte/transition";
	import compos1 from "$lib/assets/images/composi/compos1.png";
	import { page } from "$app/state";
	import { innerHeight, innerWidth } from "svelte/reactivity/window";
	import { onMount } from "svelte";
	import { useCompassQuery } from "$lib/hooks.svelte";

	const settingsItems = $state([
		{
			label: m.show_compass(),
			desc: m.show_compass_desc(),
			state: false,
		},
		{
			label: m.enable_compass_interaction(),
			desc: m.enable_compass_interaction_desc(),
			state: false,
		},
	]);

	let sidebarOpen = $state(true);

	let searchState = $state({
		query: "",
		results: [] as any[],
		pending: true,
	});

	let position = $state({
		x: (innerWidth?.current ?? 1920) / 2,
		y: (innerHeight?.current ?? 1080) / 2,
	});
	let rotation = $state(0);
	let scale = $state(1);
	const baseSize = 500;
	const minScale = 0.3;
	const maxScale = 2;

	let isDragging = $state(false);
	let isRotating = $state(false);
	let isResizing = $state(false);
	let dragOffset = $state({ x: 0, y: 0 });
	let startAngle = $state(0);
	let startRotation = $state(0);
	let startScale = $state(1);
	let startDistance = $state(0);

	function handleMouseDown(e: MouseEvent) {
		if (!settingsItems[1].state) return;
		isDragging = true;
		dragOffset.x = e.clientX - position.x;
		dragOffset.y = e.clientY - position.y;
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
	}
	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		position.x = e.clientX - dragOffset.x;
		position.y = e.clientY - dragOffset.y;
	}
	function handleMouseUp() {
		isDragging = false;
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);
	}

	function getAngleFromCenter(e: MouseEvent) {
		const dx = e.clientX - position.x;
		const dy = e.clientY - position.y;
		return Math.atan2(dy, dx) * (180 / Math.PI);
	}

	function getDistanceFromCenter(e: MouseEvent) {
		const dx = e.clientX - position.x;
		const dy = e.clientY - position.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function handleRotateStart(e: MouseEvent) {
		if (!settingsItems[1].state) return;
		e.stopPropagation();
		isRotating = true;
		startAngle = getAngleFromCenter(e);
		startRotation = rotation;
		window.addEventListener("mousemove", handleRotateMove);
		window.addEventListener("mouseup", handleRotateEnd);
	}

	function handleRotateMove(e: MouseEvent) {
		if (!isRotating) return;
		const currentAngle = getAngleFromCenter(e);
		rotation = startRotation + (currentAngle - startAngle);
	}

	function handleRotateEnd() {
		isRotating = false;
		window.removeEventListener("mousemove", handleRotateMove);
		window.removeEventListener("mouseup", handleRotateEnd);
	}

	function handleResizeStart(e: MouseEvent) {
		if (!settingsItems[1].state) return;
		e.stopPropagation();
		isResizing = true;
		startDistance = getDistanceFromCenter(e);
		startScale = scale;
		window.addEventListener("mousemove", handleResizeMove);
		window.addEventListener("mouseup", handleResizeEnd);
	}

	function handleResizeMove(e: MouseEvent) {
		if (!isResizing) return;
		const currentDistance = getDistanceFromCenter(e);
		const newScale = startScale * (currentDistance / startDistance);
		scale = Math.max(minScale, Math.min(maxScale, newScale));
	}

	function handleResizeEnd() {
		isResizing = false;
		window.removeEventListener("mousemove", handleResizeMove);
		window.removeEventListener("mouseup", handleResizeEnd);
	}

	const composiState = $state({
		pending: false,
		items: [] as any[],
		error: "",
	});

	const { compasses, mainError, loading: compassLoading } = useCompassQuery();

	let selectedCompassId = $state(0);
	const selectedCompass = $derived.by(() => {
		return $compasses.find((x) => x.id === selectedCompassId);
	});

	const selectedClient = $derived(page.url.searchParams.get("clientId"));

	onMount(async () => {
		try {
			composiState.pending = true;
			// const res = await api.get("/compass");
			// const res = await api.get(
			// 	"/compass/by-client/" + "25e7c8b2-bdea-4923-ba8a-bfe928b5af91",
			// );
			// const res = await api.get("client");
		} catch (e: any) {
			composiState.error = e.response?.data?.error || e.response?.data?.detail;
		} finally {
			composiState.pending = false;
		}
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
					{m.Compass()}

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
						placeholder={m.compass_search_placeholder()}
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
								toast.error(m.compass_location_error_toast());
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
							{m.compass_settings()}
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
											class="self-stretch justify-start text-orange-300 text-sm font-normal font-['GT_Eesti_Pro_Display'] max-w-[40ch] line-clamp-2"
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
							{m.choose_compass()} (Default)
						</div>

						<div class="flex gap-[10px]">
							{#if $compassLoading}
								{#each Array(3) as _, idx (idx)}
									<div
										in:slide|global={{
											duration: 200,
											delay: idx * 30,
										}}
										class={clsx(
											"w-28 h-28 relative rounded-xl overflow-hidden p-1 animate-pulse bg-stone-400",
										)}
									></div>
								{/each}
							{:else}
								{#each $compasses as item, idx (idx)}
									<div
										transition:slide|global={{
											duration: 200,
											delay: idx * 33,
										}}
									>
										<Button
											onclick={() => (selectedCompassId = item.id)}
											hover
											c={clsx(
												"w-28 h-28 relative rounded-xl  overflow-hidden p-1",
												selectedCompassId === item.id &&
													"ring ring-2 ring-orange-500",
											)}
										>
											<enhanced:img
												class="w-full h-full left-[4px] rounded-xl pointer-events-none"
												src={item.src}
												alt={"compass"}
											/>
										</Button>
									</div>
								{:else}
									<div
										class="w-28 h-28 relative rounded-xl overflow-hidden p-1"
									>
										{m.no_results_found()}
									</div>
								{/each}
							{/if}
						</div>
					</div>

					<div class="w-full h-[1px] bg-stone-50"></div>

					<div class="flex justify-center py-[20px]">
						<Button
							disabled={!selectedClient}
							hover
							c="px-5 py-2.5 bg-orange-500 rounded-[43px] w-fit text-orange-100 text-base font-normal font-['GT_Eesti_Pro_Display'] flex items-center gap-[10px]"
						>
							<ImageIcon />
							{m.add_photo()}
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
						{m.compass_search_results_title()}
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
							{m.no_results_found()}
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

	<div class="flex-1 w-full h-[calc(100svh-100px)] isolate">
		{#if selectedCompass && settingsItems[0].state}
			<div
				transition:fly={{ y: 10, duration: 500 }}
				class={clsx(
					"fixed z-500",
					!settingsItems[1].state && "pointer-events-none",
				)}
				style="left:{position.x}px; top:{position.y}px; transform:translate(-50%, -50%) rotate({rotation}deg); width:{baseSize *
					scale}px; height:{baseSize * scale}px;"
			>
				<!-- Main compass image - draggable -->
				<button onmousedown={handleMouseDown} class="w-full h-full cursor-move">
					<enhanced:img
						src={selectedCompass.src}
						alt={"selected compass"}
						class="w-full h-full rounded-xl pointer-events-none select-none user-select-none"
					/>
				</button>

				<!-- Corner handles (visible only when interaction is enabled) -->
				{#if settingsItems[1].state}
					<!-- Resize handles (corners) -->
					<button
						onmousedown={handleResizeStart}
						class="absolute -top-2 -left-2 w-4 h-4 bg-orange-500 rounded-full cursor-nwse-resize hover:bg-orange-600 transition-colors"
						title="Resize"
					></button>
					<button
						onmousedown={handleResizeStart}
						class="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full cursor-nesw-resize hover:bg-orange-600 transition-colors"
						title="Resize"
					></button>
					<button
						onmousedown={handleResizeStart}
						class="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-500 rounded-full cursor-nesw-resize hover:bg-orange-600 transition-colors"
						title="Resize"
					></button>
					<button
						onmousedown={handleResizeStart}
						class="absolute -bottom-2 -right-2 w-4 h-4 bg-orange-500 rounded-full cursor-nwse-resize hover:bg-orange-600 transition-colors"
						title="Resize"
					></button>

					<!-- Rotate handle (top center) -->
					<button
						onmousedown={handleRotateStart}
						class="absolute -top-8 left-1/2 -translate-x-1/2 w-5 h-5 bg-blue-500 rounded-full cursor-grab hover:bg-blue-600 transition-colors flex items-center justify-center"
						title="Rotate"
					>
						<svg
							class="w-3 h-3 text-white"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
							/>
						</svg>
					</button>
					<!-- Line connecting rotate handle to compass -->
					<div
						class="absolute -top-6 left-1/2 w-0.5 h-4 bg-blue-500 -translate-x-1/2"
					></div>
				{/if}
			</div>
		{/if}

		<Map />
	</div>
</div>
