<script lang="ts">
	import { api } from "$lib";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import { fade } from "svelte/transition";
	import Button from "./Button.svelte";
	import ReasonSelector from "./ReasonSelector.svelte";
	import toast from "svelte-french-toast";

	const contactStatusInit = {
		name: "",
		email: "",
		reason: "",
		description: "",
	};

	const contactStatus = $state({
		pending: false,
		error: contactStatusInit,
		mainError: "",
	});

	async function createConsultation(data: typeof contactStatusInit) {
		contactStatus.error = contactStatusInit;
		contactStatus.mainError = "";
		contactStatus.pending = true;
		const res = await api.post("/consultation", data);
		contactStatus.pending = false;

		if (res.status !== 200) {
			if (res.data.error) {
				contactStatus.error = res.data.error;
			} else {
				contactStatus.error = res.data;
			}
		} else if (res.data.success) {
			contactStatus.error = contactStatusInit;
			toast.success("Consultation request sent successfully!");
		} else {
			contactStatus.mainError = "Unknown error. Please try again.";
		}
	}
</script>

<section class="bg-stone-300" id="consultation">
	<div class="grid grid-cols-2">
		<img src="/consultation.png" alt="" class="w-full object-cover" />
		<div class="px-[60px] flex flex-col justify-center">
			<form
				onsubmit={async (e) => {
					e.preventDefault();
					await createConsultation(
						Object.fromEntries(
							new FormData(e.target as HTMLFormElement),
						) as typeof contactStatusInit,
					);
				}}
			>
				<div
					class="text-stone-900 text-7xl font-bold font-['GT_Eesti_Pro_Display'] leading-[63px] mb-[50px]"
				>
					Consultation
				</div>

				{#snippet field(type = "", placeholder = "", name = "")}
					<input
						{type}
						{placeholder}
						required
						class="px-5 py-[16px] bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:outline-orange-500"
					/>
				{/snippet}

				<div class="grid-cols-2 grid gap-[10px] mb-[10px]">
					<div>
						<div
							class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] mb-[6px]"
						>
							Name
						</div>
						<input
							type="text"
							placeholder="Enter your name"
							name="name"
							required
							class="px-5 py-[16px] bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:outline-orange-500"
						/>

						{#if contactStatus.error.name}
							<div
								in:fade
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
							Email
						</div>
						<input
							type="text"
							placeholder="Enter your email"
							name="email"
							required
							class="px-5 py-[16px] bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:outline-orange-500"
						/>

						{#if contactStatus.error.email}
							<div
								in:fade
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
						Сhoose the reason for the feedback
					</div>
					<ReasonSelector />
					{#if contactStatus.error.reason}
						<div
							in:fade
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
						Description
					</div>
					<textarea
						placeholder="Describe your situation in detail"
						required
						name="description"
						class=" px-5 py-[16px] bg-white rounded-[10px] placeholder:text-orange-300 text-base font-normal font-['GT_Eesti_Pro_Display'] border-0 w-full focus:outline-orange-500 min-h-[133px]"
					></textarea>

					{#if contactStatus.error.description}
						<div
							in:fade
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
							Sending...
						{:else}
							To send
						{/if}
					</Button>
				</div>
			</form>
		</div>
	</div>
</section>
