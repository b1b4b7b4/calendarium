<script>
	import { slide } from "svelte/transition";

	let { value = $bindable(""), err = $bindable(""), ...rest } = $props();
</script>

<div class="w-full flex flex-col gap-[4px]">
	<input
		class="text-white bg-transparent placeholder:text-white text-xl font-medium font-['GT_Eesti_Pro_Display'] leading-5 px-5 min-h-[52px] rounded-xl ring ring-2 ring-white inline-flex justify-start items-center gap-2.5 focus:ring-orange-500 border-0 outline-0"
		bind:value
		{...rest}
	/>

	{#if err}
		<div
			transition:slide
			class="text-red-500 text-sm font-['GT_Eesti_Pro_Display']"
		>
			{err}
		</div>
	{/if}
</div>
