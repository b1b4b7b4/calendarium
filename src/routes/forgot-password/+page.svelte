<script>
	import { goto } from "$app/navigation";
	import ProfileIcon from "$lib/assets/profileIcon.svelte";
	import Button from "$lib/components/Button.svelte";
	import clsx from "clsx";
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4"
	style="background: url('bgs/image1.png') no-repeat center/cover"
>
	<div
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

		<div
			class="text-white text-base font-bold font-['GT_Eesti_Pro_Display'] max-w-[358px] mx-auto mb-[20px] px-[16px]"
		>
			We have sent an SMS with the code to your phone or enter it in your email.
		</div>

		{#snippet field(type = "", placeholder = "")}
			<input
				{type}
				{placeholder}
				class="text-white bg-transparent placeholder:text-white text-xl font-medium font-['GT_Eesti_Pro_Display'] leading-5 px-5 min-h-[52px] rounded-xl outline outline-1 outline-offset-[-1px] outline-white inline-flex justify-start items-center gap-2.5 focus:outline-orange-500"
			/>
		{/snippet}

		<div class="grid gap-[20px] max-w-[358px] mx-auto mb-[16px]">
			{@render field("text", "Введите почту")}

			<Button
				hover
				c="px-2.5 min-h-[46px] bg-orange-500 rounded-xl text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full"
			>
				Отправить смс
			</Button>
		</div>
	</div>
</section>
