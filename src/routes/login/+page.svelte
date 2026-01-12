<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { api, saveSession } from "$lib";
	import image1 from "$lib/assets/images/bgs/image1.png";
	import LoginField from "$lib/assets/LoginField.svelte";
	import ProfileIcon from "$lib/assets/profileIcon.svelte";
	import Button from "$lib/components/Button.svelte";
	import axios from "axios";
	import clsx from "clsx";
	import { fade, slide } from "svelte/transition";
	import { m } from "$lib/paraglide/messages";
	import { localizeHref } from "$lib/paraglide/runtime";

	type LoginData = {
		email: string;
		password: string;
	};

	let loginStateInit = {
		pending: false,
		error: {
			email: "",
			password: "",
		} as LoginData,
		mainError: "",
	};
	let loginState = $state(loginStateInit);
	async function loginRequest(data: LoginData) {
		try {
			loginState = { ...loginStateInit, pending: true };
			const res = await api.post("/user/login", data);
			loginState.pending = false;
			await saveSession(res.data);
			goto(localizeHref(page.url.searchParams.get("redi") || "/"));
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				loginState.mainError = e.response.data.error || e.response.data.detail;
			} else {
				loginState.error = e.response?.data;
			}
		} finally {
			loginState.pending = false;
		}
	}
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4"
	style={`background: url(${image1}) no-repeat center/cover`}
>
	<form
		class="w-full max-w-[520px] px-5 py-10 bg-stone-900/20 backdrop-blur-[10px]"
		onsubmit={async (e) => {
			e.preventDefault();
			const formData = new FormData(e.target as HTMLFormElement);
			const data: LoginData = {
				email: formData.get("email") as string,
				password: formData.get("password") as string,
			};
			await loginRequest(data);
		}}
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
			{@render navBtn(m.login_title(), true, "/login")}
			<div
				class="w-0 h-10 outline outline-1 outline-offset-[-0.50px] outline-white"
			></div>
			{@render navBtn(m.register_link(), false, "/register")}
		</div>

		<div class="grid gap-[20px] max-w-[358px] mx-auto mb-[16px]">
			<LoginField
				type="text"
				placeholder={m.email_placeholder()}
				name="email"
				bind:err={loginState.error.email}
				required
			/>

			<LoginField
				type="password"
				placeholder={m.password_placeholder()}
				name="password"
				bind:err={loginState.error.password}
				required
			/>

			<Button
				disabled={loginState.pending}
				type="submit"
				hover
				c={"px-2.5 min-h-[46px] bg-orange-500 rounded-xl text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full"}
			>
				{#if loginState.pending}
					{m.login_loading()}
				{:else}
					{m.login_button()}
				{/if}
			</Button>
		</div>

		{#if loginState.mainError}
			<div
				transition:slide
				class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mb-4 text-center"
			>
				{loginState.mainError}
			</div>
		{/if}

		<div class="grid justify-start px-[16px] max-w-[358px] mx-auto gap-[16px]">
			<Button
				onclick={() => goto(localizeHref("/forgot-password"))}
				c="text-left self-stretch justify-start text-white text-base font-medium font-['GT_Eesti_Pro_Display'] underline leading-4"
				>{m.forgot_password_link()}</Button
			>
			<Button
				onclick={() => goto(localizeHref("/register"))}
				c="text-left self-stretch justify-start text-white text-base font-medium font-['GT_Eesti_Pro_Display'] underline leading-4"
				>{m.register_link()}</Button
			>
		</div>
	</form>
</section>
