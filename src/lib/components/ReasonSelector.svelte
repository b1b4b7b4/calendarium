<script lang="ts">
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import { fade, fly, slide } from "svelte/transition";
	import Button from "./Button.svelte";
	import { clsx } from "clsx";
	import { m } from "$lib/paraglide/messages";
	import { useReasonsQuery, type Reason } from "$lib/hooks.svelte";

	type Props = {
		options?: Reason[];
		placeholder?: string;
		selectedOptionId?: number;
		selectedOptionReason?: string;
		selectedOptionIndex?: number;
	};

	let {
		options = $bindable([]),
		placeholder = m.reason_default_placeholder(),
		selectedOptionId = $bindable(),
		selectedOptionReason = $bindable(),
		selectedOptionIndex = $bindable(),
	}: Props = $props();

	let active = $state(false);
	let dropdown: HTMLDivElement;
</script>

<div class="relative" bind:this={dropdown}>
	<input
		type="text"
		required
		name="reason"
		bind:value={selectedOptionId}
		class="opacity-0 absolute pointer-events-none inset-0"
	/>

	<Button
		type="button"
		onclick={() => (active = !active)}
		c={clsx(
			"px-5 py-[16px] bg-white rounded-[10px] text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full flex justify-between items-center cursor-pointer",
			active && "ring-2 ring-orange-500",
		)}
	>
		{#if selectedOptionReason}
			<span>{selectedOptionReason}</span>
		{:else}
			<span class="text-orange-300">{placeholder}</span>
		{/if}
		<div
			class={clsx(
				"transition-transform duration-150",
				active ? "rotate-180" : "rotate-0",
			)}
		>
			<ArrowDownIcon c="fill-black" />
		</div>
	</Button>

	{#if active}
		<div
			in:fly={{ y: -10, opacity: 0, duration: 350 }}
			out:fly={{ y: -10, opacity: 0, duration: 150 }}
			class="absolute top-[calc(100%+10px)] shadow-2xl inset-x-0 grid p-4 bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:outline-orange-500 z-20"
		>
			{#each options as option, idx (idx)}
				<button
					transition:fade|global={{ duration: 250, delay: idx * 35 }}
					type="button"
					class="text-left w-full cursor-pointer py-1"
					onclick={() => {
						selectedOptionId = option.id;
						selectedOptionReason = option.reason;
						selectedOptionIndex = idx;
						active = false;
					}}>{option.reason}</button
				>
			{/each}
		</div>
	{/if}
</div>

<svelte:body
	onclick={(e) => {
		if (dropdown && !dropdown.contains(e.target as Node)) {
			active = false;
		}
	}}
/>
