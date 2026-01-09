<script lang="ts">
	import { goto } from "$app/navigation";
	import { api } from "$lib";
	import ProfileIcon from "$lib/assets/profileIcon.svelte";
	import Button from "$lib/components/Button.svelte";
	import clsx from "clsx";
	import { fade } from "svelte/transition";

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
		registerState = { ...loginStateInit, pending: true };
		const res = await api.post("/user/register", data);
		registerState.pending = false;

		if (res.status !== 200) {
			if (res.data.error) {
				registerState.mainError = res.data.error;
			} else {
				registerState.error = res.data;
			}
		} else if (res.data.success) {
			registerState = { ...loginStateInit };
			goto("/");
		} else {
			registerState.mainError =
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
			{@render navBtn("Вход", false, "/login")}
			<div
				class="w-0 h-10 outline outline-1 outline-offset-[-0.50px] outline-white"
			></div>
			{@render navBtn("Регистрация", true, "/register")}
		</div>

		<div class="grid gap-[20px] max-w-[358px] mx-auto mb-[16px]">
			<input
				type="text"
				placeholder="Эл. почта"
				name="email"
				required
				class="text-white bg-transparent placeholder:text-white text-xl font-medium font-['GT_Eesti_Pro_Display'] leading-5 px-5 min-h-[52px] rounded-xl outline outline-1 outline-offset-[-1px] outline-white inline-flex justify-start items-center gap-2.5 focus:outline-orange-500"
			/>

			{#if registerState.error.email}
				<div in:fade class="text-red-500 text-sm font-['GT_Eesti_Pro_Display']">
					{registerState.error.email}
				</div>
			{/if}

			<input
				type="password"
				placeholder="Пароль"
				name="password"
				required
				class="text-white bg-transparent placeholder:text-white text-xl font-medium font-['GT_Eesti_Pro_Display'] leading-5 px-5 min-h-[52px] rounded-xl outline outline-1 outline-offset-[-1px] outline-white inline-flex justify-start items-center gap-2.5 focus:outline-orange-500"
			/>

			{#if registerState.error.password}
				<div in:fade class="text-red-500 text-sm font-['GT_Eesti_Pro_Display']">
					{registerState.error.password}
				</div>
			{/if}

			<input
				type="password"
				placeholder="Повторите пароль"
				name="confirmPassword"
				required
				class="text-white bg-transparent placeholder:text-white text-xl font-medium font-['GT_Eesti_Pro_Display'] leading-5 px-5 min-h-[52px] rounded-xl outline outline-1 outline-offset-[-1px] outline-white inline-flex justify-start items-center gap-2.5 focus:outline-orange-500"
			/>

			{#if registerState.error.confirm_password}
				<div in:fade class="text-red-500 text-sm font-['GT_Eesti_Pro_Display']">
					{registerState.error.confirm_password}
				</div>
			{/if}

			<label class="grid grid-cols-[auto_1fr] gap-[20px] cursor-pointer">
				<input type="checkbox" class="mt-1 checked:bg-orange-500" required />
				<span
					class="text-white text-base font-normal font-['GT_Eesti_Pro_Display'] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]"
				>
					Согласен с политикой конфиденциальности и политикой оферты
				</span>
			</label>

			<Button
				disabled={registerState.pending}
				type="submit"
				hover
				c="px-2.5 min-h-[46px] bg-orange-500 rounded-xl text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full"
			>
				{#if registerState.pending}
					Загрузка...
				{:else}
					Регистрация
				{/if}
			</Button>
		</div>

		{#if registerState.mainError}
			<div
				in:fade
				class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mb-4 text-center"
			>
				{registerState.mainError}
			</div>
		{/if}

		<div class="grid justify-start px-[16px] max-w-[358px] mx-auto gap-[16px]">
			<Button
				onclick={() => goto("/login")}
				c="text-left self-stretch justify-start text-white text-base font-medium font-['GT_Eesti_Pro_Display'] underline leading-4"
				>Уже есть аккаунт ?</Button
			>
		</div>
	</form>
</section>
