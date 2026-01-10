<script lang="ts">
	import { goto } from "$app/navigation";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import FacebookIcon from "$lib/assets/facebookIcon.svelte";
	import InstaIcon from "$lib/assets/instaIcon.svelte";
	import Rock from "$lib/assets/rock.svelte";
	import TgIcon from "$lib/assets/tgIcon.svelte";
	import YoutubeIcon from "$lib/assets/youtubeIcon.svelte";
	import Button from "$lib/components/Button.svelte";

	const menuItems = [
		{ name: "Main", link: "/" },
		{ name: "About me", link: "/#about-me" },
		{ name: "About the master", link: "/#about-master" },
		{ name: "Bazi Basics", link: "/#bazi-basics" },
		{ name: "Consultation", link: "/#consultation" },
		{ name: "Privacy policy", link: "/privacy" },
	];
</script>

<div class="bg-stone-900">
	<div
		class="container min-h-[119px] grid items-center px-[40px] grid-cols-[1fr_auto_1fr] gap-[20px] max-[950px]:grid-cols-[auto_1fr]"
	>
		<Button
			c="flex flex-col items-center max-[950px]:hidden"
			onclick={() => goto("/")}
		>
			<div
				class="text-center justify-start text-orange-100 text-3xl font-medium font-['GT_Eesti_Pro_Display'] leading-9"
			>
				Bazi App
			</div>
			<div class="w-7 h-0.5 bg-orange-500 rounded-[3px]" />
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

		{#snippet socialBtn(icon: any)}
			<Button
				hover
				c="w-full max-w-7 min-h-7 rounded-full border border-orange-100 flex items-center justify-center"
			>
				{@render icon()}
			</Button>
		{/snippet}

		<div class="flex justify-end gap-[10px]">
			{@render socialBtn(TgIcon)}
			{@render socialBtn(InstaIcon)}
			{@render socialBtn(FacebookIcon)}
			{@render socialBtn(YoutubeIcon)}
		</div>
	</div>
</div>
