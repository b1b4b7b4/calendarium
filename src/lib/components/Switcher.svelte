<script>
	import clsx from "clsx";

	let { active = $bindable(false) } = $props();
</script>

<div class="w-[50px] min-h-7 relative bg-white rounded-[30px] overflow-hidden">
	<input bind:checked={active} type="checkbox" hidden />
	<div
		class={clsx(
			"w-6 h-6 left-[2px] top-[2px] right-[2px] absolute rounded-full shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] transition-all",
			active
				? "translate-x-[calc(100%-3px)] bg-orange-500"
				: "translate-x-0 bg-orange-300",
		)}
	></div>
</div>
