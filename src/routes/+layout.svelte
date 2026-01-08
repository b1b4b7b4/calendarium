<script lang="ts">
	import { page } from "$app/state";
	import { locales, localizeHref } from "$lib/paraglide/runtime";
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { onMount, setContext } from "svelte";
	import { writable } from "svelte/store";

	let { children } = $props();

	type User = {
		id: number;
		first_name: string;
		last_name: string;
		email: string;
		phone_number: string;
	};

	type Session = { user?: User };
	const currentSession = writable<Session>(page.data as any);
	setContext("currentSession", currentSession);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Header />
{@render children()}
<Footer />

<!-- <div> -->
<!-- 	{#each locales as locale} -->
<!-- 		<a href={localizeHref(page.url.pathname, { locale })}> -->
<!-- 			{locale} -->
<!-- 		</a> -->
<!-- 	{/each} -->
<!-- </div> -->
