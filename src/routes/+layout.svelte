<script lang="ts">
	import { page } from "$app/state";
	import { locales, localizeHref } from "$lib/paraglide/runtime";
	import { m } from "$lib/paraglide/messages";
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { onMount, setContext } from "svelte";
	import { writable } from "svelte/store";
	import { Toaster } from "svelte-french-toast";
	import {
		api,
		areYouSureContinue,
		areYouSureModalActive,
		currentSession,
	} from "$lib";
	import { fade, fly } from "svelte/transition";
	import Button from "$lib/components/Button.svelte";

	let { children } = $props();

	currentSession.set(page.data as any);
	$effect(() => {
		currentSession.set(page.data as any);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{m.app_title()}</title>
</svelte:head>

<Toaster position="bottom-right" />

<div class="min-h-screen grid grid-rows-[auto_1fr_auto]">
	<Header />
	<div>
		{@render children()}
	</div>
	<Footer />

	{#if $areYouSureModalActive}
		<div
			onclick={() => {
				areYouSureModalActive.set(false);
				areYouSureContinue.set(() => {});
			}}
			transition:fade={{ duration: 300 }}
			class="fixed inset-0 z-100 bg-black/30 backdrop-blur-blur"
		></div>

		<div
			transition:fly={{ y: 20, duration: 200 }}
			class="fixed z-101 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-96 bg-orange-100 rounded-xl p-[20px] hide-body-scroll max-h-[80vh] overflow-y-auto hide-scrollbar"
		>
			<div
				class="text-stone-900 text-xl font-bold font-['GT_Eesti_Pro_Display'] mb-2 text-center"
			>
				{m.are_you_sure()}
			</div>

			<div
				class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[10px] text-center"
			>
				{m.this_action_cannot_be_undone()}
			</div>

			<div
				class="flex gap-[10px] mt-8"
				in:fly={{ y: 10, opacity: 0, duration: 200, delay: 30 }}
			>
				<Button
					hover
					c="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full max-w-44 px-2.5 bg-orange-500 rounded-xl outline outline-1 outline-offset-[-1px] outline-orange-500 min-h-[47px]"
					onclick={async () => {
						await $areYouSureContinue();
						areYouSureModalActive.set(false);
						areYouSureContinue.set(() => {});
					}}
				>
					{m.yes()}
				</Button>
				<Button
					hover
					c="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full max-w-44 px-2.5 bg-stone-300 rounded-xl outline outline-1 outline-offset-[-1px] outline-stone-300 min-h-[47px]"
					onclick={() => {
						areYouSureModalActive.set(false);
						areYouSureContinue.set(() => {});
					}}
				>
					{m.no()}
				</Button>
			</div>
		</div>
	{/if}
</div>

<!-- <div> -->
<!-- 	{#each locales as locale} -->
<!-- 		<a href={localizeHref(page.url.pathname, { locale })}> -->
<!-- 			{locale} -->
<!-- 		</a> -->
<!-- 	{/each} -->
<!-- </div> -->
