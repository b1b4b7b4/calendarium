<script lang="ts">
	import { imask } from "@imask/svelte";
	import clsx from "clsx";

	let {
		match = "",
		value = $bindable(""),
		title = "",
		c = "",
		...rest
	} = $props();
</script>

<label
	class={clsx(
		"px-2.5 py-[7px] bg-white rounded-xl focus-within:ring-2 ring-orange-500 flex flex-col justify-center",
		c,
	)}
>
	<div
		class="text-stone-400 text-xs font-normal font-['GT_Eesti_Pro_Display'] h-[14px]"
	>
		{title}
	</div>

	<input
		use:imask={{
			mask: match,
			lazy: true,
		}}
		bind:value
		type="text"
		class="text-stone-950 text-sm font-normal font-['GT_Eesti_Pro_Display'] w-full border-0 ring-0 p-0 m-0 bg-transparent"
		{...rest}
	/>
</label>
