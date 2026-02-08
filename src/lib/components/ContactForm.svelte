<script lang="ts">
	import { api } from "$lib";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import { fade, slide } from "svelte/transition";
	import Button from "./Button.svelte";
	import ReasonSelector from "./ReasonSelector.svelte";
	import toast from "svelte-french-toast";
	import consultation from "$lib/assets/images/consultation.png";
	import { contact_reason_billing, m } from "$lib/paraglide/messages";
	import {
		useCreateConsultationMutation,
		useReasonsQuery,
		type Reason,
	} from "$lib/hooks.svelte";
	import {
		contact_reason_general,
		contact_reason_technical,
	} from "../../paraglide/messages";

	const { mainError, loading, errors, createConsultation } =
		useCreateConsultationMutation();
	const fields = $state({
		name: "",
		email: "",
		reason: "",
		description: "",
	});

	const reasons = [
		{
			id: 1,
			reason: m.contact_reason_general(),
		},
		{
			id: 2,
			reason: m.contact_reason_technical(),
		},
		{
			id: 3,
			reason: m.contact_reason_billing(),
		},
		{
			id: 4,
			reason: m.contact_reason_feedback(),
		},
		{
			id: 5,
			reason: m.contact_reason_other(),
		},
	];
</script>

<section class="bg-stone-300" id="consultation">
	<div class="grid grid-cols-2 max-[1000px]:grid-cols-1">
		<enhanced:img
			src={consultation}
			alt=""
			class="w-full h-full object-cover max-[1000px]:hidden"
		/>
		<div class="p-[60px] flex flex-col justify-center">
			<form
				onsubmit={async (e: any) => {
					e.preventDefault();
					if (await createConsultation(fields)) {
						e.target.reset();
					}
				}}
			>
				<div
					class="text-stone-900 text-7xl font-bold font-['GT_Eesti_Pro_Display'] leading-[63px] mb-[50px] max-[600px]:text-5xl max-[600px]:leading-[45px]"
				>
					{m.contact_consultation()}
				</div>

				<div class="grid-cols-2 grid gap-[10px] mb-[10px]">
					<div>
						<div
							class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[6px]"
						>
							{m.contact_name()}
						</div>
						<input
							type="text"
							placeholder={m.contact_name_placeholder()}
							bind:value={fields.name}
							required
							class="px-5 py-[16px] bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:ring-2 focus:ring-orange-500"
						/>

						{#if $errors.name}
							<div
								transition:slide
								class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mt-1"
							>
								{$errors.name}
							</div>
						{/if}
					</div>

					<div>
						<div
							class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[6px]"
						>
							{m.contact_email()}
						</div>
						<input
							type="text"
							placeholder={m.contact_email_placeholder()}
							bind:value={fields.email}
							required
							class="px-5 py-[16px] bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:ring-2 focus:ring-orange-500"
						/>

						{#if $errors.email}
							<div
								transition:slide
								class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mt-1"
							>
								{$errors.email}
							</div>
						{/if}
					</div>
				</div>

				<div class="mb-[10px]">
					<div
						class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[6px]"
					>
						{m.contact_reason_label()}
					</div>
					<ReasonSelector
						options={reasons}
						bind:selectedOptionReason={fields.reason}
					/>
					{#if $errors.reason}
						<div
							transition:slide
							class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mt-1"
						>
							{$errors.reason}
						</div>
					{/if}
				</div>

				<div class="mb-[10px]">
					<div
						class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[6px]"
					>
						{m.contact_description()}
					</div>
					<textarea
						placeholder={m.contact_description_placeholder()}
						required
						bind:value={fields.description}
						class=" px-5 py-[16px] bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:ring-2 focus:ring-orange-500 min-h-[133px]"
					></textarea>

					{#if $errors.description}
						<div
							transition:slide
							class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mt-1"
						>
							{$errors.description}
						</div>
					{/if}

					{#if $mainError}
						<div
							transition:slide
							class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mt-1"
						>
							{$mainError}
						</div>
					{/if}
				</div>

				<div class="flex justify-end">
					<Button
						disabled={$loading}
						type="submit"
						hover
						c="text-orange-100 text-base font-normal font-['GT_Eesti_Pro_Display'] min-w-44 px-5 bg-orange-500 rounded-[43px] min-h-[39px]"
					>
						{#if $loading}
							{m.contact_sending()}
						{:else}
							{m.contact_send()}
						{/if}
					</Button>
				</div>
			</form>
		</div>
	</div>
</section>
