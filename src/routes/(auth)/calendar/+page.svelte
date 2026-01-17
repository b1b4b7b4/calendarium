<script lang="ts">
	import { api } from "$lib";
	import ArrowDownIcon from "$lib/assets/ArrowDownIcon.svelte";
	import ArrowLeftIcon from "$lib/assets/arrowLeftIcon.svelte";
	import ArrowRightIcon from "$lib/assets/arrowRightIcon.svelte";
	import SearchIcon from "$lib/assets/searchIcon.svelte";
	import SuperArrowRight from "$lib/assets/SuperArrowRight.svelte";
	import Button from "$lib/components/Button.svelte";
	import type { Client } from "$lib/types";
	import { onMount } from "svelte";
	import toast from "svelte-french-toast";
	import { m } from "$lib/paraglide/messages";
	import { fade, fly, slide } from "svelte/transition";
	import image from "$lib/assets/images/bgs/image.png";
	import DateField from "$lib/components/DateField.svelte";
	import { clsx } from "clsx";

	const daysOfWeek = [
		m.short_sunday(),
		m.short_monday(),
		m.short_tuesday(),
		m.short_wednesday(),
		m.short_thursday(),
		m.short_friday(),
		m.short_saturday(),
	];

	const today = new Date();
	const dates = $state({
		hours:
			today.getHours().toString().padStart(2, "0") +
			":" +
			today.getMinutes().toString().padStart(2, "0"),
		days: today.getDate().toString(),
		months: today.getMonth() + 1 + "",
		years: today.getFullYear() + "",
	});

	const date = $derived(
		new Date(
			Number(dates.years),
			Number(dates.months) - 1,
			Number(dates.days),
			Number(dates.hours.split(":")[0]),
			Number(dates.hours.split(":")[1]),
		),
	);

	function previousMonth() {
		let month = date.getMonth() - 1;
		let year = date.getFullYear();
		if (month < 1) {
			month = 12;
			year -= 1;
		}
		dates.months = month.toString();
		dates.years = year.toString();
	}

	function nextMonth() {
		let month = parseInt(dates.months) + 1;
		let year = parseInt(dates.years);
		if (month > 12) {
			month = 1;
			year += 1;
		}
		dates.months = month.toString();
		dates.years = year.toString();
	}

	const daysInMonth = $derived(() => {
		const month = date.getMonth();
		const year = date.getFullYear();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const totalDays = lastDay.getDate();
		const startDayOfWeek = firstDay.getDay();
		const days = [];

		// Previous month padding
		const prevMonth = month === 0 ? 11 : month - 1;
		const prevYear = month === 0 ? year - 1 : year;
		const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
		for (let i = startDayOfWeek - 1; i >= 0; i--) {
			days.push({
				date: new Date(prevYear, prevMonth, prevMonthLastDay - i),
				isCurrentMonth: false,
				dayNumber: prevMonthLastDay - i,
				isToday: false,
			});
		}

		// Current month days
		for (let day = 1; day <= totalDays; day++) {
			const dateObj = new Date(year, month, day);
			days.push({
				date: dateObj,
				isCurrentMonth: true,
				dayNumber: day,
				isToday:
					dateObj.getDate() === today.getDate() &&
					dateObj.getMonth() === today.getMonth() &&
					dateObj.getFullYear() === today.getFullYear(),
			});
		}

		// Next month padding
		const nextMonth = month === 11 ? 0 : month + 1;
		const nextYear = month === 11 ? year + 1 : year;
		let nextDay = 1;
		while (days.length < 42) {
			days.push({
				date: new Date(nextYear, nextMonth, nextDay),
				isCurrentMonth: false,
				dayNumber: nextDay,
				isToday: false,
			});
			nextDay++;
		}
		return days;
	});
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4 bg-no-repeat bg-center bg-cover"
	style={`background-image: url(${image});`}
>
	<div class="bg-stone-900/20 backdrop-blur-[10px] p-[40px]">
		<div class="bg-stone-300 p-[16px]">
			<div class="flex items-center gap-[6px]">
				<Button hover c="hover:bg-white p-2 rounded-lg" onclick={previousMonth}>
					<ArrowLeftIcon />
				</Button>
				<div class="flex gap-[8px] items-center">
					<DateField
						match="00:00"
						title={m.hour_title()}
						bind:value={dates.hours}
						required
					/>
					<DateField
						match="00"
						title={m.day_title()}
						bind:value={dates.days}
						required
					/>
					<DateField
						match="00"
						title={m.month_title()}
						bind:value={dates.months}
						required
					/>
					<DateField
						match="0000"
						title={m.year_title()}
						bind:value={dates.years}
						required
					/>
				</div>
				<Button hover c="hover:bg-white p-2 rounded-lg" onclick={nextMonth}>
					<div class="rotate-180">
						<ArrowLeftIcon />
					</div>
				</Button>
			</div>

			<div class="bg-white">
				<div class="grid grid-cols-7 place-items-center mt-[20px]">
					{#each daysOfWeek as day}
						<div
							class="text-stone-900 text-sm font-normal font-['GT_Eesti_Pro_Display'] min-h-[32px] flex items-center justify-center"
						>
							{day}
						</div>
					{/each}
				</div>

				<div
					class="absolute [position-anchor:--calbg] left-[anchor(left)] right-[anchor(right)] bottom-[anchor(bottom)] top-[anchor(top)] bg-orange-500/20 transition-all pointer-events-none rounded-lg"
				></div>
				<div class="grid grid-cols-7 place-items-center p-[4px]">
					{#each daysInMonth() as day, idx}
						<div
							class="w-full h-16 p-1 hover:[anchor-name:--calbg]"
							in:fade|global={{ duration: 200, delay: idx * 4 }}
						>
							<Button
								onclick={() => {
									dates.days = day.dayNumber.toString();
									dates.months = (day.date.getMonth() + 1).toString();
									dates.years = day.date.getFullYear().toString();
								}}
								c={clsx(
									"text-stone-900 text-xl font-normal font-['GT_Eesti_Pro_Display'] w-full h-full rounded-lg flex items-center justify-center ",
									day.isToday && "font-bold bg-orange-200",
									!day.isCurrentMonth && "opacity-50",
									day.date.getDate() === Number(dates.days) &&
										day.isCurrentMonth &&
										"bg-orange-500 text-white",
								)}
							>
								{day.dayNumber}
							</Button>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
