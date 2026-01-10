<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { api, saveSession } from "$lib";
	import ProfileIcon from "$lib/assets/profileIcon.svelte";
	import Button from "$lib/components/Button.svelte";
	import axios from "axios";
	import clsx from "clsx";
	import { fade } from "svelte/transition";

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
		loginState = { ...loginStateInit, pending: true };
		const res = await api.post("/user/login", data);
		loginState.pending = false;

		if (res.status !== 200) {
			if (res.data.error) {
				loginState.mainError = res.data.error;
			} else {
				loginState.error = res.data;
			}
		} else if (res.data.success) {
			loginState.mainError = await saveSession(res.data);
			goto(page.url.searchParams.get("redi") ?? "/");
		} else {
			loginState.mainError =
				"Неизвестная ошибка. Пожалуйста, попробуйте еще раз.";
		}

		return res.data;
	}
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4"
	style="background: url('bgs/image1.png') no-repeat center/cover"
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
				onclick={() => goto(link)}
				c={clsx(
					"text-xl font-['GT_Eesti_Pro_Display'] leading-5 font-black",
					active ? "text-orange-500" : "text-white",
				)}
			>
				{text}</Button
			>
		{/snippet}

		<div class="grid grid-cols-[1fr_auto_1fr] mb-[40px] place-items-center">
			{@render navBtn("Вход", true, "/login")}
			<div
				class="w-0 h-10 outline outline-1 outline-offset-[-0.50px] outline-white"
			></div>
			{@render navBtn("Регистрация", false, "/register")}
		</div>

		<div class="grid gap-[20px] max-w-[358px] mx-auto mb-[16px]">
			<input
				type="text"
				placeholder="Электронная почта"
				name="email"
				class="text-white bg-transparent placeholder:text-white text-xl font-medium font-['GT_Eesti_Pro_Display'] leading-5 px-5 min-h-[52px] rounded-xl outline outline-1 outline-offset-[-1px] outline-white inline-flex justify-start items-center gap-2.5 focus:outline-orange-500"
				required
			/>
			{#if loginState.error.email}
				<div in:fade class="text-red-500 text-sm font-['GT_Eesti_Pro_Display']">
					{loginState.error.email}
				</div>
			{/if}

			<input
				type="password"
				placeholder="Пароль"
				name="password"
				class="text-white bg-transparent placeholder:text-white text-xl font-medium font-['GT_Eesti_Pro_Display'] leading-5 px-5 min-h-[52px] rounded-xl outline outline-1 outline-offset-[-1px] outline-white inline-flex justify-start items-center gap-2.5 focus:outline-orange-500"
				required
			/>
			{#if loginState.error.password}
				<div in:fade class="text-red-500 text-sm font-['GT_Eesti_Pro_Display']">
					{loginState.error.password}
				</div>
			{/if}

			<Button
				disabled={loginState.pending}
				type="submit"
				hover
				c={"px-2.5 min-h-[46px] bg-orange-500 rounded-xl text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full"}
			>
				{#if loginState.pending}
					Загрузка...
				{:else}
					Вход
				{/if}
			</Button>
		</div>

		{#if loginState.mainError}
			<div
				in:fade
				class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mb-4 text-center"
			>
				{loginState.mainError}
			</div>
		{/if}

		<div class="grid justify-start px-[16px] max-w-[358px] mx-auto gap-[16px]">
			<Button
				onclick={() => goto("/forgot-password")}
				c="text-left self-stretch justify-start text-white text-base font-medium font-['GT_Eesti_Pro_Display'] underline leading-4"
				>Забыли пароль?</Button
			>
			<Button
				onclick={() => goto("/register")}
				c="text-left self-stretch justify-start text-white text-base font-medium font-['GT_Eesti_Pro_Display'] underline leading-4"
				>Регистрация</Button
			>
		</div>
	</form>
</section>
