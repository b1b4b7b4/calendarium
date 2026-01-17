<script lang="ts">
	import { Menu, MenuSquare } from "@lucide/svelte";
	import { goto } from "$app/navigation";
	import {
		currentSession,
		removeSession,
		settingsModal,
		asideModal,
		api,
		debounce,
	} from "$lib";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import ArrowLeftIcon from "$lib/assets/arrowLeftIcon.svelte";
	import CloseIcon from "$lib/assets/closeIcon.svelte";
	import Rock from "$lib/assets/rock.svelte";
	import Button from "$lib/components/Button.svelte";
	import { m } from "$lib/paraglide/messages";
	import { localizeHref } from "$lib/paraglide/runtime";
	import clsx from "clsx";
	import { getContext } from "svelte";
	import toast from "svelte-french-toast";
	import { bounceIn, bounceOut, cubicIn, cubicInOut } from "svelte/easing";
	import { fly, fade, slide } from "svelte/transition";
	import { imask } from "@imask/svelte";
	import { page } from "$app/state";

	const menuItems = [
		{ name: m.Main(), link: "/" },
		{ name: m.Calculator(), link: "/calculator" },
		{ name: m.Calendar(), link: "/calendar" },
		{ name: m.Compass(), link: "/compass" },
		{ name: m.My_Clients(), link: "/clients" },
		{ name: m.Consultations(), link: "/#consultation" },
	];

	const settingsItems = [
		{ link: "/", name: m.our_app() },
		{ link: "/", name: m.facebook() },
		{ link: "/", name: m.instagram() },
		{ link: "/", name: m.linkedin() },
		{ link: "/privacy", name: m.Privacy_Policy() },
	];

	const updateFormStateInit = {
		pending: false,
		mainError: "",
		error: {
			full_name: "",
			phone_number: "",
		},
	};

	const fields = $state({
		full_name: $currentSession?.user?.full_name ?? "",
		phone_number: $currentSession?.user?.phone_number ?? "",
	});

	let updateFormState = $state(updateFormStateInit);

	async function updateFormStateRequest() {
		try {
			updateFormState = {
				...updateFormStateInit,
				pending: true,
			};

			const [first_name, ...last_name_parts] = fields.full_name.split(" ");
			const res = await api.patch(`user/${$currentSession.user?.id}`, {
				first_name: first_name,
				last_name: last_name_parts.join(" "),
				phone_number: fields.phone_number,
			});
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				updateFormState.mainError =
					e.response.data.error || e.response.data.detail;
			} else {
				updateFormState.error = e.response?.data;
			}
		} finally {
			updateFormState.pending = false;
		}
	}
</script>

<div class="bg-stone-900">
	<div
		class="container min-h-[80px] grid items-center px-[40px] grid-cols-[1fr_auto_1fr] gap-[20px] max-[850px]:grid-cols-[auto_1fr]"
	>
		<Button
			c="flex items-center gap-[10px] max-[850px]:hidden"
			onclick={() => goto(localizeHref("/"))}
		>
			<Rock />
			<div
				class="text-center justify-start text-orange-100 text-3xl font-medium font-['GT_Eesti_Pro_Display'] leading-9"
			>
				Bazi
			</div>
		</Button>

		<Button
			onclick={() => asideModal.update((x) => !x)}
			c="min-[750px]:hidden"
			hover><Menu class="text-orange-100" /></Button
		>

		<nav class="flex items-center justify-center max-[750px]:hidden h-full">
			<div
				class="absolute inset-0 rounded-lg bg-zinc-500/10 [position-anchor:--navbtn] left-[anchor(left)] right-[anchor(right)] top-[anchor(top)] bottom-[anchor(bottom)] transition-all"
			></div>
			{#each menuItems as item, idx}
				<Button
					hover
					c={clsx(
						"group justify-start text-orange-100 text-base font-normal font-['GT_Eesti_Pro_Display'] text-nowrap h-full",
					)}
					onclick={() => goto(localizeHref(item.link))}
				>
					<div class="group-hover:[anchor-name:--navbtn] px-[10px] py-[5px]">
						{item.name}
					</div>
				</Button>
			{/each}
		</nav>

		<div class="flex justify-end">
			{#if !$currentSession.user}
				<Button
					onclick={() => goto(localizeHref("/login"))}
					hover
					c="justify-start text-orange-100 text-base font-normal font-['GT_Eesti_Pro_Display'] px-5 rounded-[43px] outline outline-2 outline-offset-[-2px] outline-orange-100 w-full max-w-[130px] min-h-[39px]  text-nowrap "
				>
					{m.login_button()}
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
	<div
		transition:fade
		onclick={() => settingsModal.set(false)}
		class="fixed inset-0 z-100 bg-black/30 backdrop-blur-blur"
	></div>

	<div
		transition:fly={{ y: 20, duration: 200 }}
		class="fixed z-101 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-96 bg-orange-100 rounded-xl p-[20px] hide-body-scroll max-h-[80vh] overflow-y-auto hide-scrollbar"
	>
		<div
			class="text-stone-900 text-xl font-bold font-['GT_Eesti_Pro_Display'] flex justify-between items-center"
		>
			{m.settings()}
			<Button hover c="" onclick={() => settingsModal.set(false)}>
				<CloseIcon />
			</Button>
		</div>

		<div class="w-full h-[1px] bg-white my-[20px]"></div>

		<div
			class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[10px]"
		>
			{m.personal_data()}
		</div>

		<div
			oninput={debounce(() => {
				updateFormStateRequest();
			}, 500)}
			class="grid gap-[10px]"
			in:fly={{ y: 10, opacity: 0, duration: 200, delay: 30 }}
		>
			<label
				class="w-full block px-4 py-2.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-500/5"
			>
				<div
					class="text-orange-300 text-sm font-normal font-['GT_Eesti_Pro_Display']"
				>
					{m.full_name()}
				</div>
				<input
					type="text"
					class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] p-0 m-0 bg-transparent outline-none w-full border-0 focus:ring-0"
					bind:value={fields.full_name}
				/>
			</label>

			<label
				class="w-full block px-4 py-2.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-500/5"
			>
				<div
					class="text-orange-300 text-sm font-normal font-['GT_Eesti_Pro_Display']"
				>
					{m.phone_number()}
				</div>
				<input
					use:imask={{ mask: "+00000000000", lazy: true }}
					type="text"
					class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] p-0 m-0 bg-transparent outline-none w-full border-0 focus:ring-0"
					bind:value={fields.phone_number}
				/>
			</label>

			<Button
				onclick={() => {
					goto(localizeHref("/forgot-password"));
					settingsModal.set(false);
				}}
				hover
				c="px-4 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-500/5 text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] flex justify-between items-center w-full"
			>
				{m.change_password()}
				<div class="rotate-180">
					<ArrowLeftIcon />
				</div>
			</Button>
		</div>

		<div class="w-full h-[1px] bg-white my-[20px]"></div>
		<div
			class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[10px]"
		>
			{m.about_site()}
		</div>

		<div
			class="grid gap-[10px]"
			in:fly={{ y: 10, opacity: 0, duration: 200, delay: 50 }}
		>
			{#each settingsItems as item, idx}
				<div
					in:fly|global={{
						y: 10,
						opacity: 0,
						duration: 200,
						delay: 33 * idx + 70,
					}}
				>
					<Button
						onclick={() => {
							goto(localizeHref(item.link));
							settingsModal.set(false);
						}}
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

		<div in:fly|global={{ y: 10, opacity: 0, duration: 200, delay: 80 }}>
			<Button
				onclick={async () => {
					const error = await removeSession();
					if (error) {
						toast.error(m.header_logout_error_toast());
						return;
					}
					settingsModal.set(false);
				}}
				hover
				c="px-4 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-500/5 text-red-500 text-base font-normal font-['GT_Eesti_Pro_Display'] flex justify-between items-center w-full"
			>
				{m.logout_account()}
				<div class="rotate-180">
					<ArrowLeftIcon />
				</div>
			</Button>
		</div>
	</div>
{/if}

{#if $asideModal}
	<div
		transition:fade={{ duration: 300 }}
		onclick={() => asideModal.set(false)}
		class="fixed inset-0 z-100 bg-black/30 backdrop-blur-blur"
	></div>

	<div
		transition:fly={{ x: -200, duration: 500 }}
		class="fixed z-101 left-0 top-0 w-[250px] h-full bg-orange-100 p-[20px] hide-body-scroll flex flex-col"
	>
		<div
			class="text-stone-900 text-xl font-bold font-['GT_Eesti_Pro_Display'] flex justify-between items-center mb-[20px]"
		>
			{m.menu()}
			<Button hover c="" onclick={() => asideModal.set(false)}>
				<CloseIcon />
			</Button>
		</div>

		<nav class="flex flex-col gap-[15px]">
			{#each menuItems as item, idx}
				<div
					class="w-full"
					transition:fly|global={{
						x: -20,
						opacity: 0,
						duration: 300,
						delay: 33 * idx + 100,
					}}
				>
					<Button
						hover
						c="justify-start text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] text-nowrap "
						onclick={() => {
							goto(localizeHref(item.link));
							asideModal.set(false);
						}}
					>
						{item.name}
					</Button>
				</div>
			{/each}
		</nav>
	</div>
{/if}
