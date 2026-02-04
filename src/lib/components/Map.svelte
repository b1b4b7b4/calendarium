<script lang="ts">
	import { selectedMapCoords } from "$lib";
	import { onMount } from "svelte";
	import { m } from "$lib/paraglide/messages";
	import { on } from "svelte/events";

	let mapBlock: HTMLDivElement;

	onMount(() => {
		// @ts-ignore
		const L = window.L;
		const initMap = () => {
			const map = L.map(mapBlock, {
				center: $selectedMapCoords,
				zoom: 13,
			});

			L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: m.map_copyright(),
			}).addTo(map);

			selectedMapCoords.subscribe((coords) => {
				if (map) {
					map.setView(coords, map.getZoom());
				}
			});
		};

		if (L) {
			initMap();
		} else {
			const script = document.querySelector('script[src*="leaflet"]');
			script?.addEventListener("load", initMap);
		}
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin=""
	/>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"
		integrity="sha512-BwHfrr4c9kmRkLw6iXFdzcdWV/PGkVgiIyIWLLlTSXzWQzxuSg4DiQUCpauz/EWjgk5TYQqX/kvn9pG1NpYfqg=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	></script>
</svelte:head>

<div bind:this={mapBlock} class="w-full h-full"></div>
