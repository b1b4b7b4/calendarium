<script lang="ts">
	import { imask } from "@imask/svelte";
	import { slide } from "svelte/transition";

	let {
		error = $bindable(""),
		mask = null as null | Record<string, any>,
		value = $bindable(""),
		...rest
	} = $props();
</script>

<div class="w-full flex-col gap-[4px] mb-[16px]">
	{#if mask}
		<input
			use:imask={mask}
			bind:value
			class="min-h-12 px-[20px] bg-white rounded-xl placeholder:text-stone-400 text-base font-normal font-['GT_Eesti_Pro_Display'] leading-4 border-0 outline-0 w-full ring-0 focus-within:ring-2 ring-orange-500"
			{...rest}
		/>
	{:else}
		<input
			bind:value
			class="min-h-12 px-[20px] bg-white rounded-xl placeholder:text-stone-400 text-base font-normal font-['GT_Eesti_Pro_Display'] leading-4 border-0 outline-0 w-full ring-0 focus-within:ring-2 ring-orange-500"
			{...rest}
		/>
	{/if}
	{#if error}
		<div
			transition:slide
			class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mt-1"
		>
			{error}
		</div>
	{/if}
</div>
