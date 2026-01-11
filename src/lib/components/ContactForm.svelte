<script lang="ts">
	import { api } from "$lib";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import { fade, slide } from "svelte/transition";
	import Button from "./Button.svelte";
	import ReasonSelector from "./ReasonSelector.svelte";
	import toast from "svelte-french-toast";
	import consultation from "$lib/assets/images/consultation.png";
	import { m } from '$lib/paraglide/messages';

	const contactStatusInit = {
		name: "",
		email: "",
		reason: "" as any,
		description: "",
	};

	const contactStates = $state(contactStatusInit);
	const reasons = [
		m.contact_reason_general(),
		m.contact_reason_technical(),
		m.contact_reason_billing(),
		m.contact_reason_feedback(),
		m.contact_reason_other(),
	];

	let contactStatus = $state({
		pending: false,
		error: contactStatusInit,
		mainError: "",
	});

	async function createConsultation(data: typeof contactStatusInit) {
		try {
			contactStatus = {
				mainError: "",
				pending: true,
				error: contactStatusInit,
			};
			const res = await api.post("/consultation", data);
			contactStatus.pending = false;
			toast.success(m.contact_success_toast());
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				contactStatus.mainError =
					e.response.data.error || e.response.data.detail;
			} else {
				contactStatus.error = e.response?.data;
			}
		} finally {
			contactStatus.pending = false;
		}
	}
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
				onsubmit={async (e) => {
					e.preventDefault();
					await createConsultation({
						name: contactStates.name,
						email: contactStates.email,
						reason: reasons.indexOf(contactStates.reason),
						description: contactStates.description,
					});
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
							bind:value={contactStates.name}
							required
							class="px-5 py-[16px] bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:ring-2 focus:ring-orange-500"
						/>

						{#if contactStatus.error.name}
							<div
								transition:slide
								class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mt-1"
							>
								{contactStatus.error.name}
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
							bind:value={contactStates.email}
							required
							class="px-5 py-[16px] bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:ring-2 focus:ring-orange-500"
						/>

						{#if contactStatus.error.email}
							<div
								transition:slide
								class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mt-1"
							>
								{contactStatus.error.email}
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
						selectedOption={contactStates.reason}
					/>
					{#if contactStatus.error.reason}
						<div
							transition:slide
							class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mt-1"
						>
							{contactStatus.error.reason}
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
						bind:value={contactStates.description}
						class=" px-5 py-[16px] bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:ring-2 focus:ring-orange-500 min-h-[133px]"
					></textarea>

					{#if contactStatus.error.description}
						<div
							transition:slide
							class="text-red-500 text-sm font-['GT_Eesti_Pro_Display'] mt-1"
						>
							{contactStatus.error.description}
						</div>
					{/if}
				</div>

				<div class="flex justify-end">
					<Button
						disabled={contactStatus.pending}
						type="submit"
						hover
						c="text-orange-100 text-base font-normal font-['GT_Eesti_Pro_Display'] min-w-44 px-5 bg-orange-500 rounded-[43px] min-h-[39px]"
					>
						{#if contactStatus.pending}
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
