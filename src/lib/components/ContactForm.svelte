<script lang="ts">
	import { api } from "$lib";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import { fade, slide } from "svelte/transition";
	import Button from "./Button.svelte";
	import ReasonSelector from "./ReasonSelector.svelte";
	import toast from "svelte-french-toast";
	import consultation from "$lib/assets/images/consultation.png";

	const contactStatusInit = {
		name: "",
		email: "",
		reason: "",
		description: "",
	};

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
			toast.success("Consultation request sent successfully!");
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
					await createConsultation(
						Object.fromEntries(
							new FormData(e.target as HTMLFormElement),
						) as typeof contactStatusInit,
					);
				}}
			>
				<div
					class="text-stone-900 text-7xl font-bold font-['GT_Eesti_Pro_Display'] leading-[63px] mb-[50px] max-[600px]:text-5xl max-[600px]:leading-[45px]"
				>
					Consultation
				</div>

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
							Email
						</div>
						<input
							type="text"
							placeholder="Enter your email"
							name="email"
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
						Сhoose the reason for the feedback
					</div>
					<ReasonSelector />
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
						Description
					</div>
					<textarea
						placeholder="Describe your situation in detail"
						required
						name="description"
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
