<script>
	import clsx from "clsx";

	const { children, hover = false, active = true, c, ...restProps } = $props();
</script>

<button
	class={clsx(
		"cursor-pointer transition-all duration-100 w-fit",
		hover && "hover:scale-[1.02]",
		active && "active:scale-[0.98]",
		c,
	)}
	{...restProps}>{@render children()}</button
>
