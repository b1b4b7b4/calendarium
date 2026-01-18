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
	import { useLoginMutation } from "$lib/hooks.svelte";

	const { mainError, login, loading, errors } = useLoginMutation();

	const fields = $state({
		email: "",
		password: "",
	});
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4"
	style={`background: url(${image1}) no-repeat center/cover`}
>
	<form
		class="w-full max-w-[520px] px-5 py-10 bg-stone-900/20 backdrop-blur-[10px]"
		onsubmit={async (e) => {
			e.preventDefault();
			await login(fields);
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
				bind:value={fields.email}
				bind:err={$errors.email}
				name="email"
				required
			/>

			<LoginField
				type="password"
				placeholder={m.password_placeholder()}
				bind:value={fields.password}
				bind:err={$errors.password}
				name="password"
				required
			/>

			<Button
				disabled={$loading}
				type="submit"
				hover
				c={"px-2.5 min-h-[46px] bg-orange-500 rounded-xl text-white text-base font-bold font-['GT_Eesti_Pro_Display'] leading-4 w-full"}
			>
				{#if $loading}
					{m.login_loading()}
				{:else}
					{m.login_button()}
				{/if}
			</Button>
		</div>

		{#if $mainError}
			<div
				transition:slide
				class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mb-4 text-center"
			>
				{$mainError}
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
