<script lang="ts">
	import { goto } from "$app/navigation";
	import { api } from "$lib";
	import ProfileIcon from "$lib/assets/profileIcon.svelte";
	import Button from "$lib/components/Button.svelte";
	import clsx from "clsx";
	import toast from "svelte-french-toast";
	import { fade } from "svelte/transition";

	const resetPasswordStateInit = {
		email: "",
	};
	let step = $state(1);
	let resetPasswordState = $state({
		pending: false,
		error: { ...resetPasswordStateInit },
		mainError: "",
	});
	async function resetPasswordRequest(data: typeof resetPasswordStateInit) {
		resetPasswordState = {
			error: resetPasswordStateInit,
			pending: true,
			mainError: "",
		};

		const res = await api.post("/user/send_reset_code", data);
		resetPasswordState.pending = false;

		if (res.status !== 200) {
			if (res.data.error) {
				resetPasswordState.mainError = res.data.error;
			} else {
				resetPasswordState.error = res.data;
			}
		} else if (res.data.success) {
			resetPasswordState = {
				error: resetPasswordStateInit,
				pending: false,
				mainError: "",
			};
			toast.success("Смс с кодом отправлено на вашу почту!");
			step = 2;
		} else {
			resetPasswordState.mainError =
				"Неизвестная ошибка. Пожалуйста, попробуйте еще раз.";
		}
	}
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4"
	style="background: url('bgs/image1.png') no-repeat center/cover"
>
	<form
		onsubmit={async (e) => {
			e.preventDefault();
			switch (step) {
				case 1:
					await resetPasswordRequest(
						Object.fromEntries(
							new FormData(e.target as HTMLFormElement),
						) as typeof resetPasswordStateInit,
					);
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

		{#if step === 1}
			<div
				class="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] max-w-[358px] mx-auto mb-[20px] px-[16px]"
			>
				We have sent an SMS with the code to your phone or enter it in your
				email.
			</div>

			<div class="grid gap-[20px] max-w-[358px] mx-auto mb-[16px]">
				<input
					type="text"
					placeholder="Введите почту"
					name="email"
					required
					class="text-white bg-transparent placeholder:text-white text-xl font-medium font-['GT_Eesti_Pro_Display'] leading-5 px-5 min-h-[52px] rounded-xl outline outline-1 outline-offset-[-1px] outline-white inline-flex justify-start items-center gap-2.5 focus:outline-orange-500"
				/>

				{#if resetPasswordState.mainError}
					<div
						in:fade
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
						Отправка...
					{:else}
						Отправить смс
					{/if}
				</Button>
			</div>
		{:else if step === 2}
			<Button
				disabled={resetPasswordState.pending}
				type="submit"
				hover
				c="px-2.5 min-h-[46px] bg-orange-500 rounded-xl text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full"
			>
				{#if resetPasswordState.pending}
					Отправка...
				{:else}
					Отправить
				{/if}
			</Button>
		{/if}
	</form>
</section>
