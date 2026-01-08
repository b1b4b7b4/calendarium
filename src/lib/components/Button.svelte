<script>
	import clsx from "clsx";

	const {
		children,
		disabled = false,
		hover = false,
		active = true,
		c,
		...restProps
	} = $props();
</script>

<button
	type="button"
	class={clsx(
		"transition-all duration-100 w-fit",
		hover && "hover:scale-[1.02]",
		active && "active:scale-[0.98]",
		disabled ? "cursor-not-allowed opacity-75" : "cursor-pointer",
		c,
	)}
	{disabled}
	{...restProps}>{@render children()}</button
>
