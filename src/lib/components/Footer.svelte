<script lang="ts">
	import { goto } from "$app/navigation";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import FacebookIcon from "$lib/assets/facebookIcon.svelte";
	import InstaIcon from "$lib/assets/instaIcon.svelte";
	import Rock from "$lib/assets/rock.svelte";
	import TgIcon from "$lib/assets/tgIcon.svelte";
	import YoutubeIcon from "$lib/assets/youtubeIcon.svelte";
	import Button from "$lib/components/Button.svelte";
	import { m } from "$lib/paraglide/messages";
	import {
		localizeHref,
		locales,
		isLocale,
		setLocale,
	} from "$lib/paraglide/runtime";
	import clsx from "clsx";

	const menuItems = [
		{ name: m.Main(), link: "/" },
		{ name: m.about_me(), link: "/#about-me" },
		{ name: m.about_the_master(), link: "/#about-master" },
		{ name: m.bazi_basics(), link: "/#bazi-basics" },
		{ name: m.consultation(), link: "/#consultation" },
		{ name: m.privacy_policy(), link: "/privacy" },
	];

	let langSelector = $state(false);
</script>

<div class="bg-stone-900">
	<div
		class="container min-h-[119px] grid items-center px-[40px] grid-cols-[1fr_auto_1fr] gap-[20px] max-[950px]:grid-cols-[auto_1fr] max-[850px]:grid-cols-1 max-[850px]:py-5 max-[850px]:place-items-center"
	>
		<Button
			c="flex flex-col items-center max-[950px]:hidden"
			onclick={() => goto(localizeHref("/"))}
		>
			<div
				class="text-center justify-start text-orange-100 text-3xl font-medium font-['GT_Eesti_Pro_Display'] leading-9"
			>
				{m.bazi_app()}
			</div>
			<div class="w-7 h-0.5 bg-orange-500 rounded-[3px]" />
		</Button>

		<nav
			class="flex items-center gap-[20px] justify-center max-[850px]:flex-wrap"
		>
			{#each menuItems as item}
				<Button
					hover
					c="text-orange-100 text-base font-normal font-['GT_Eesti_Pro_Display'] text-nowrap "
					onclick={() => goto(localizeHref(item.link))}
				>
					{item.name}
				</Button>
			{/each}
		</nav>

		{#snippet socialBtn(icon: any)}
			<Button
				hover
				c="p-1 rounded-full border border-orange-100 flex items-center justify-center"
			>
				{@render icon()}
			</Button>
		{/snippet}

		<div class="flex justify-end gap-[10px]">
			{@render socialBtn(TgIcon)}
			{@render socialBtn(InstaIcon)}
			{@render socialBtn(FacebookIcon)}
			{@render socialBtn(YoutubeIcon)}

			<div class="ml-4 flex gap-[10px]">
				{#each locales as loc}
					<Button
						onclick={() => setLocale(loc)}
						c="flex items-center gap-[10px] cursor-pointer"
					>
						<div
							class="justify-start text-white text-base font-normal font-['GT_Eesti_Pro_Display']"
						>
							{loc}
						</div>
					</Button>
				{/each}
			</div>
		</div>
	</div>
</div>
