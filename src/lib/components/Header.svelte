<script>
	import { goto } from "$app/navigation";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import Rock from "$lib/assets/rock.svelte";
	import Button from "$lib/components/Button.svelte";
	import { m } from "$lib/paraglide/messages";
	import { getContext } from "svelte";

	const menuItems = [
		{ name: m.Main(), link: "/" },
		{ name: m.Calculator(), link: "/calculator" },
		{ name: m.Calendar(), link: "/calendar" },
		{ name: m.Compass(), link: "/compass" },
		{ name: m.My_Clients(), link: "/clients" },
		{ name: m.Consultations(), link: "/#consultation" },
	];

	const logined = false;

	const currentSession = getContext("currentSession");
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
			{#if !$currentSession.user}
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
						{$currentSession.user.email}
					</div>
					<ArrowDownIcon />
				</div>
			{/if}
		</div>
	</div>
</div>
