<script>
	import { goto } from "$app/navigation";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import Rock from "$lib/assets/rock.svelte";
	import Button from "$lib/components/Button.svelte";

	const menuItems = [
		{ name: "Main", link: "/" },
		{ name: "Calculator", link: "/calculator" },
		{ name: "Calendar", link: "/calendar" },
		{ name: "Compass", link: "/compass" },
		{ name: "My clients", link: "/clients" },
		{ name: "Consultation", link: "/consultation" },
	];

	const logined = false;
</script>

<div class="bg-stone-900">
	<div
		class="container min-h-[80px] grid items-center px-[40px] grid-cols-[1fr_auto_1fr] gap-[20px]"
	>
		<Button c="flex items-center gap-[10px]" onclick={() => goto("/")}>
			<Rock />
			<div
				class="text-center justify-start text-orange-100 text-3xl font-medium font-['GT_Eesti_Pro_Display'] leading-9"
			>
				Bazi
			</div>
		</Button>

		<nav class="flex items-center gap-[20px] justify-center">
			{#each menuItems as item}
				<Button
					hover
					c="justify-start text-orange-100 text-base font-normal font-['GT_Eesti_Pro_Display']"
					onclick={() => goto(item.link)}
				>
					{item.name}
				</Button>
			{/each}
		</nav>

		<div class="flex justify-end">
			{#if !logined}
				<Button
					onclick={() => goto("/login")}
					hover
					c="justify-start text-orange-100 text-base font-normal font-['GT_Eesti_Pro_Display'] px-5 rounded-[43px] outline outline-2 outline-offset-[-2px] outline-orange-100 w-full max-w-[130px] min-h-[39px]"
				>
					Log in
				</Button>
			{:else}
				<div class="flex items-center gap-[10px] cursor-pointer">
					<div
						class="justify-start text-white text-base font-normal font-['GT_Eesti_Pro_Display']"
					>
						Maghzum Ayash
					</div>
					<ArrowDownIcon />
				</div>
			{/if}
		</div>
	</div>
</div>
