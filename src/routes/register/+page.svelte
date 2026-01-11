<script lang="ts">
	import { goto } from "$app/navigation";
	import { api } from "$lib";
	import { m } from "$lib/paraglide/messages";
	import { localizeHref } from "$lib/paraglide/runtime";
	import LoginField from "$lib/assets/LoginField.svelte";
	import ProfileIcon from "$lib/assets/profileIcon.svelte";
	import Button from "$lib/components/Button.svelte";
	import clsx from "clsx";
	import { fade, slide } from "svelte/transition";
	import image1 from "$lib/assets/images/bgs/image1.png";

	type RegisterData = {
		email: string;
		password: string;
		confirm_password: string;
	};

	let loginStateInit = {
		pending: false,
		error: {
			email: "",
			password: "",
			confirm_password: "",
		} as RegisterData,
		mainError: "",
	};
	let registerState = $state(loginStateInit);
	async function registerRequest(data: RegisterData) {
		try {
			registerState = { ...loginStateInit, pending: true };
			const res = await api.post("/user/register", data);
			registerState.pending = false;
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				registerState.mainError =
					e.response.data.error || e.response.data.detail;
			} else {
				registerState.error = e.response?.data;
			}
		} finally {
			registerState.pending = false;
		}
	}
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4 bg-no-repeat bg-cover bg-center"
	style={`background-image: url(${image1})`}
>
	<form
		onsubmit={async (e) => {
			e.preventDefault();
			const data = new FormData(e.target as HTMLFormElement);
			await registerRequest({
				email: data.get("email") as string,
				password: data.get("password") as string,
				confirm_password: data.get("confirmPassword") as string,
			});
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
			{@render navBtn(m.login_button(), false, "/login")}
			<div
				class="w-0 h-10 outline outline-1 outline-offset-[-0.50px] outline-white"
			></div>
			{@render navBtn(m.register_button(), true, "/register")}
		</div>

		<div class="grid gap-[20px] max-w-[358px] mx-auto mb-[16px]">
			<LoginField
				type="text"
				placeholder={m.register_email_placeholder()}
				name="email"
				bind:err={registerState.error.email}
				required
			/>

			<LoginField
				type="password"
				placeholder={m.register_password_placeholder()}
				name="password"
				bind:err={registerState.error.password}
				required
			/>

			<LoginField
				type="password"
				placeholder={m.register_confirm_placeholder()}
				name="confirmPassword"
				bind:err={registerState.error.confirm_password}
				required
			/>

			<label class="grid grid-cols-[auto_1fr] gap-[20px] cursor-pointer">
				<input
					type="checkbox"
					class="mt-1 checked:bg-orange-500 ring-0"
					required
				/>
				<span
					class="text-white text-base font-normal font-['GT_Eesti_Pro_Display'] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]"
				>
					{m.agree_privacy_offer()}
				</span>
			</label>

			<Button
				disabled={registerState.pending}
				type="submit"
				hover
				c="px-2.5 min-h-[46px] bg-orange-500 rounded-xl text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full"
			>
				{#if registerState.pending}
					{m.loading()}
				{:else}
					{m.register_button()}
				{/if}
			</Button>
		</div>

		{#if registerState.mainError}
			<div
				transition:slide
				class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mb-4 text-center"
			>
				{registerState.mainError}
			</div>
		{/if}

		<div class="grid justify-start px-[16px] max-w-[358px] mx-auto gap-[16px]">
			<Button
				onclick={() => goto(localizeHref("/login"))}
				c="text-left self-stretch justify-start text-white text-base font-medium font-['GT_Eesti_Pro_Display'] underline leading-4"
				>{m.account_exists()}</Button
			>
		</div>
	</form>
</section>
