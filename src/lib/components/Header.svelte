<script>
	import { goto } from "$app/navigation";
	import { settingsModal } from "$lib";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import ArrowLeftIcon from "$lib/assets/arrowLeftIcon.svelte";
	import CloseIcon from "$lib/assets/closeIcon.svelte";
	import Rock from "$lib/assets/rock.svelte";
	import Button from "$lib/components/Button.svelte";
	import { m } from "$lib/paraglide/messages";
	import clsx from "clsx";
	import { getContext } from "svelte";
	import { bounceIn, bounceOut, cubicIn, cubicInOut } from "svelte/easing";
	import { spring } from "svelte/motion";
	import { fly, fade } from "svelte/transition";

	const menuItems = [
		{ name: m.Main(), link: "/" },
		{ name: m.Calculator(), link: "/calculator" },
		{ name: m.Calendar(), link: "/calendar" },
		{ name: m.Compass(), link: "/compass" },
		{ name: m.My_Clients(), link: "/clients" },
		{ name: m.Consultations(), link: "/#consultation" },
	];

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
				<Button
					c="flex items-center gap-[10px] cursor-pointer"
					onclick={() => settingsModal.update((x) => !x)}
				>
					<div
						class="justify-start text-white text-base font-normal font-['GT_Eesti_Pro_Display']"
					>
						{$currentSession.user.email}
					</div>
					<div
						class={clsx(
							$settingsModal ? "rotate-180" : "rotate-0",
							"transition-transform",
						)}
					>
						<ArrowDownIcon c="fill-white" />
					</div>
				</Button>
			{/if}
		</div>
	</div>
</div>

{#if $settingsModal && $currentSession.user}
	<div in:fade out:fade class="fixed inset-0 z-100">
		<div
			onclick={() => settingsModal.set(false)}
			class="bg-black/30 backdrop-blur-blur absolute inset-0"
		></div>
	</div>

	<div
		in:fly={{ y: 20, duration: 200 }}
		out:fly={{ y: 20, duration: 200 }}
		class="fixed z-101 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-96 bg-orange-100 rounded-xl p-[20px]"
	>
		<div
			class="text-stone-900 text-xl font-bold font-['GT_Eesti_Pro_Display'] flex justify-between items-center"
		>
			Setting
			<Button hover c="" onclick={() => settingsModal.set(false)}>
				<CloseIcon />
			</Button>
		</div>

		<div class="w-full h-[1px] bg-white my-[20px]"></div>

		<!-- 		<div class="self-stretch  inline-flex flex-col justify-start items-start gap-px"> -->
		<!--     <div class="self-stretch justify-start "></div> -->
		<!--     <div class="self-stretch justify-start "></div> -->
		<!-- </div> -->

		<div
			class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[10px]"
		>
			Personal data
		</div>

		<!-- <div class="self-stretch inline-flex flex-col justify-start items-start gap-px"> -->

		<div
			class="grid gap-[10px]"
			in:fly={{ y: 10, opacity: 0, duration: 200, delay: 30 }}
		>
			<label
				class="w-full block px-4 py-2.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-500/5"
			>
				<div
					class="text-orange-300 text-sm font-normal font-['GT_Eesti_Pro_Display']"
				>
					Full name
				</div>
				<input
					type="text"
					class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] p-0 m-0 bg-transparent outline-none w-full border-0 focus:ring-0"
					value={$currentSession.user.email}
				/>
			</label>

			<label
				class="w-full block px-4 py-2.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-500/5"
			>
				<div
					class="text-orange-300 text-sm font-normal font-['GT_Eesti_Pro_Display']"
				>
					Phone number
				</div>
				<input
					type="text"
					class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] p-0 m-0 bg-transparent outline-none w-full border-0 focus:ring-0"
					value={$currentSession.user.phone}
				/>
			</label>

			<Button
				hover
				c="px-4 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-500/5 text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] flex justify-between items-center w-full"
			>
				Change your password
				<div class="rotate-180">
					<ArrowLeftIcon />
				</div>
			</Button>
		</div>

		<div class="w-full h-[1px] bg-white my-[20px]"></div>
		<div
			class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[10px]"
		>
			About the site
		</div>

		<div
			class="grid gap-[10px]"
			in:fly={{ y: 10, opacity: 0, duration: 200, delay: 50 }}
		>
			<!-- Our app -->
			<!-- Facebook -->
			<!-- Instagram -->
			<!-- LinkedIn -->
			<!-- Privacy policy -->
			{#each [{ name: "Our app" }, { name: "Facebook" }, { name: "Instagram" }, { name: "LinkedIn" }, { name: "Privacy policy" }] as item, idx}
				<div>
					<Button
						hover
						c="px-4 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-500/5 text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] flex justify-between items-center w-full"
					>
						{item.name}
						<div class="rotate-180">
							<ArrowLeftIcon />
						</div>
					</Button>
				</div>
			{/each}
		</div>

		<div class="w-full h-[1px] bg-white my-[20px]"></div>

		<div in:fly={{ y: 10, opacity: 0, duration: 200, delay: 80 }}>
			<Button
				hover
				c="px-4 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-500/5 text-red-500 text-base font-normal font-['GT_Eesti_Pro_Display'] flex justify-between items-center w-full"
			>
				Log out of your account
				<div class="rotate-180">
					<ArrowLeftIcon />
				</div>
			</Button>
		</div>
	</div>
{/if}
