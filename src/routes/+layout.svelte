<script lang="ts">
	import { page } from "$app/state";
	import { locales, localizeHref } from "$lib/paraglide/runtime";
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { onMount, setContext } from "svelte";
	import { writable } from "svelte/store";
	import { Toaster } from "svelte-french-toast";
	import { currentSession } from "$lib";

	let { children } = $props();

	type User = {
		id: number;
		first_name: string;
		last_name: string;
		email: string;
		phone_number: string;
	};

	currentSession.set(page.data as any);
	$effect(() => {
		currentSession.set(page.data as any);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" as="image" href="/bgs/image.png" />
	<link rel="preload" as="image" href="/bgs/image1.png" />
	<link rel="preload" as="image" href="/bgs/image3.png" />
	<title>Bazi App</title>
</svelte:head>

<Toaster position="bottom-right" />

<div class="min-h-screen grid grid-rows-[auto_1fr_auto]">
	<Header />
	<div>
		{@render children()}
	</div>
	<Footer />
</div>

<!-- <div> -->
<!-- 	{#each locales as locale} -->
<!-- 		<a href={localizeHref(page.url.pathname, { locale })}> -->
<!-- 			{locale} -->
<!-- 		</a> -->
<!-- 	{/each} -->
<!-- </div> -->
