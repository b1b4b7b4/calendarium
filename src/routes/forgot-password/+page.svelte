<script lang="ts">
	import { goto } from "$app/navigation";
	import { m } from "$lib/paraglide/messages";
	import { api } from "$lib";
	import LoginField from "$lib/assets/LoginField.svelte";
	import ProfileIcon from "$lib/assets/profileIcon.svelte";
	import Button from "$lib/components/Button.svelte";
	import clsx from "clsx";
	import toast from "svelte-french-toast";
	import { fade, slide } from "svelte/transition";
	import { localizeHref } from "$lib/paraglide/runtime";
	import image1 from "$lib/assets/images/bgs/image1.png";

	const resetPasswordStateInit = {
		email: "",
		code: "",
		password: "",
		confirm_password: "",
	};

	let step = $state(1);
	let code = $state(Array(4).fill(""));
	let email = $state("");
	let password = $state("");
	let confirm_password = $state("");

	let resetPasswordState = $state({
		pending: false,
		error: { ...resetPasswordStateInit },
		mainError: "",
	});
	async function sendResetCode(data: Partial<typeof resetPasswordStateInit>) {
		try {
			resetPasswordState = {
				error: resetPasswordStateInit,
				pending: true,
				mainError: "",
			};
			const res = await api.post("/user/send_reset_code", data);
			step = 2;
			toast.success(m.forgot_code_sent_toast());
			resetPasswordState.pending = false;
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				resetPasswordState.mainError =
					e.response.data.error || e.response.data.detail;
			} else {
				resetPasswordState.error = e.response?.data;
			}
		} finally {
			resetPasswordState.pending = false;
		}
	}

	async function verifyResetCode(data: Partial<typeof resetPasswordStateInit>) {
		try {
			resetPasswordState = {
				error: resetPasswordStateInit,
				pending: true,
				mainError: "",
			};

			const res = await api.post("/user/verify_reset_code", data);
			resetPasswordState.pending = false;
			step = 3;
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				resetPasswordState.mainError =
					e.response.data.error || e.response.data.detail;
			} else {
				resetPasswordState.error = e.response?.data;
			}
		} finally {
			resetPasswordState.pending = false;
		}
	}

	async function resetPassword(data: Partial<typeof resetPasswordStateInit>) {
		try {
			resetPasswordState = {
				error: resetPasswordStateInit,
				pending: true,
				mainError: "",
			};

			const res = await api.post("/user/set_new_password", data);
			resetPasswordState.pending = false;
			goto(localizeHref("/login"));
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				resetPasswordState.mainError =
					e.response.data.error || e.response.data.detail;
			} else {
				resetPasswordState.error = e.response?.data;
			}
		} finally {
			resetPasswordState.pending = false;
		}
	}
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4 no-repeat bg-cover bg-center"
	style={`background-image: url(${image1})`}
>
	<form
		onsubmit={async (e) => {
			e.preventDefault();
			switch (step) {
				case 1:
					await sendResetCode({ email });
					break;
				case 2:
					await verifyResetCode({ email, code: code.join("") });
					break;
				case 3:
					await resetPassword({
						email,
						password,
						confirm_password,
					});
					break;
			}
		}}
		class="w-full max-w-[520px] px-5 py-10 bg-stone-900/20 backdrop-blur-[10px]"
	>
		<div class="mb-[26px] flex justify-center">
			<ProfileIcon />
		</div>

		{#snippet navBtn(text = "", active = false, link = "")}
			<Button
				hover
				onclick={() => goto(localizeHref(link))}
				c={clsx(
					"text-xl font-['GT_Eesti_Pro_Display'] leading-5 font-black",
					active ? "text-orange-500" : "text-white",
				)}
			>
				{text}</Button
			>
		{/snippet}

		<div class="grid grid-cols-[1fr_auto_1fr] mb-[40px] place-items-center">
			{@render navBtn(m.forgot_login_button(), true, "/login")}
			<div
				class="w-0 h-10 outline outline-1 outline-offset-[-0.50px] outline-white"
			></div>
			{@render navBtn(m.forgot_register_button(), false, "/register")}
		</div>

		{#if step === 1}
			<div
				class="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] max-w-[358px] mx-auto mb-[20px] px-[16px]"
			>
				{m.forgot_step1_description()}
			</div>

			<div class="grid gap-[20px] max-w-[358px] mx-auto mb-[16px]">
				<LoginField
					type="text"
					placeholder={m.forgot_email_placeholder()}
					name="email"
					bind:value={email}
					bind:err={resetPasswordState.error.email}
					required
				/>

				{#if resetPasswordState.mainError}
					<div
						transition:slide
						class="text-red-500 text-sm font-['GT_Eesti_Pro_Display']"
					>
						{resetPasswordState.mainError}
					</div>
				{/if}

				<Button
					disabled={resetPasswordState.pending}
					type="submit"
					hover
					c="px-2.5 min-h-[46px] bg-orange-500 rounded-xl text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full"
				>
					{#if resetPasswordState.pending}
						{m.forgot_sending_button()}
					{:else}
						{m.forgot_send_sms_button()}
					{/if}
				</Button>
			</div>
		{:else if step === 2}
			<div class="max-w-[358px] mx-auto">
				<div
					class="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] mb-[20px]"
				>
					{m.forgot_verify_email_title()}
				</div>

				<div class="grid grid-cols-4 gap-2.5 mb-[10px]">
					{#each code as _, i}
						<input
							type="text"
							class="w-20 h-16 bg-stone-300 rounded-[10px] placeholder:text-stone-400 text-3xl font-normal font-['GT_Eesti_Pro_Display'] focus:outline-orange-500 text-center border-0 outline-none ring-2 ring-transparent focus:ring-orange-500"
							required
							bind:value={code[i]}
							oninput={(e) => {
								const input = e.target as HTMLInputElement;
								if (input.value && i < code.length - 1) {
									const nextInput =
										input.nextElementSibling as HTMLInputElement;
									nextInput.focus();
								} else if (!input.value && i > 0) {
									const prevInput =
										input.previousElementSibling as HTMLInputElement;
									prevInput.focus();
								}
							}}
							maxlength="1"
						/>
					{/each}
				</div>

				{#if resetPasswordState.mainError}
					<div
						transition:slide
						class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mb-[10px]"
					>
						{resetPasswordState.mainError}
					</div>
				{/if}

				<div
					class="text-white text-sm font-normal font-['GT_Eesti_Pro_Display'] mb-[20px]"
				>
					{m.forgot_resend_timer()}
				</div>

				<Button
					disabled={resetPasswordState.pending}
					type="submit"
					hover
					c="px-2.5 min-h-[46px] bg-orange-500 rounded-xl text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full"
				>
					{#if resetPasswordState.pending}
						{m.loading()}
					{:else}
						{m.login_button()}
					{/if}
				</Button>
			</div>
		{:else if step === 3}
			<div class="max-w-[358px] mx-auto grid gap-[20px]">
				<LoginField
					type="password"
					placeholder={m.forgot_new_password_placeholder()}
					name="password"
					bind:value={password}
					bind:err={resetPasswordState.error.password}
					required
				/>

				<LoginField
					type="password"
					placeholder={m.forgot_confirm_password_placeholder()}
					name="confirm_password"
					bind:value={confirm_password}
					bind:err={resetPasswordState.error.confirm_password}
					required
				/>

				{#if resetPasswordState.mainError}
					<div
						transition:slide
						class="text-red-500 text-sm font-['GT_Eesti_Pro_Display']"
					>
						{resetPasswordState.mainError}
					</div>
				{/if}

				<Button
					disabled={resetPasswordState.pending}
					type="submit"
					hover
					c="px-2.5 min-h-[46px] bg-orange-500 rounded-xl text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full"
				>
					{#if resetPasswordState.pending}
						{m.loading()}
					{:else}
						{m.login_button()}
					{/if}
				</Button>
			</div>
		{/if}
	</form>
</section>
