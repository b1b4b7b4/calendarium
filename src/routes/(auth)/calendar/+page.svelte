<script lang="ts">
	import ArrowLeftIcon from "$lib/assets/arrowLeftIcon.svelte";
	import Button from "$lib/components/Button.svelte";
	import { m } from "$lib/paraglide/messages";
	import image from "$lib/assets/images/bgs/image.png";
	import DateField from "$lib/components/DateField.svelte";
	import { clsx } from "clsx";
	// @ts-ignore
	import { Solar } from "lunar-javascript";
	import BaziBlock from "$lib/components/BaziBlock.svelte";
	import FileIcon from "$lib/assets/fileIcon.svelte";
	import ShareIcon from "$lib/assets/shareIcon.svelte";
	import { captureBlock } from "$lib";

	const today = new Date();
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth() + 1;
	const currentDay = today.getDate();
	let baziBlockRef: any = $state(null);

	const dates = $state({
		hours:
			today.getHours().toString().padStart(2, "0") +
			":" +
			today.getMinutes().toString().padStart(2, "0"),
		days: today.getDate().toString(),
		months: (today.getMonth() + 1).toString(),
		years: today.getFullYear().toString(),
	});

	const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	interface CalendarDay {
		day: number;
		month: number;
		year: number;
		isCurrentMonth: boolean;
		isToday: boolean;
		isSelected: boolean;
		lunar: {
			dayInChinese: string;
			heavenlyStem: string;
			earthlyBranch: string;
		};
	}

	// Compute calendar grid data
	const calendarDays = $derived.by(() => {
		const year = parseInt(dates.years) || currentYear;
		const month = parseInt(dates.months) || currentMonth;
		const selectedDay = parseInt(dates.days) || 1;

		// First day of the month
		const firstDayOfMonth = new Date(year, month - 1, 1);
		const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

		// Days in current month
		const daysInMonth = new Date(year, month, 0).getDate();

		// Days in previous month
		const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

		const days: CalendarDay[] = [];

		// Previous month days (fill in before first day)
		for (let i = startingDayOfWeek - 1; i >= 0; i--) {
			const day = daysInPrevMonth - i;
			const prevMonth = month === 1 ? 12 : month - 1;
			const prevYear = month === 1 ? year - 1 : year;
			days.push(
				createCalendarDay(
					prevYear,
					prevMonth,
					day,
					false,
					selectedDay,
					month,
					year,
				),
			);
		}

		// Current month days
		for (let day = 1; day <= daysInMonth; day++) {
			days.push(
				createCalendarDay(year, month, day, true, selectedDay, month, year),
			);
		}

		// Next month days (fill remaining grid)
		const remainingCells = 42 - days.length; // 6 rows × 7 columns = 42
		for (let day = 1; day <= remainingCells; day++) {
			const nextMonth = month === 12 ? 1 : month + 1;
			const nextYear = month === 12 ? year + 1 : year;
			days.push(
				createCalendarDay(
					nextYear,
					nextMonth,
					day,
					false,
					selectedDay,
					month,
					year,
				),
			);
		}

		return days;
	});

	function createCalendarDay(
		year: number,
		month: number,
		day: number,
		isCurrentMonth: boolean,
		selectedDay: number,
		selectedMonth: number,
		selectedYear: number,
	): CalendarDay {
		const solar = Solar.fromYmd(year, month, day);
		const lunar = solar.getLunar();
		const bazi = lunar.getEightChar();

		// Get the day's Gan-Zhi (heavenly stem + earthly branch)
		const dayGanZhi = bazi.getDay();
		const heavenlyStem = dayGanZhi[0];
		const earthlyBranch = dayGanZhi[1];

		// Lunar day in Chinese (初一, 初二, etc.)
		const dayInChinese = lunar.getDayInChinese();

		return {
			day,
			month,
			year,
			isCurrentMonth,
			isToday:
				year === currentYear && month === currentMonth && day === currentDay,
			isSelected:
				isCurrentMonth &&
				day === selectedDay &&
				month === selectedMonth &&
				year === selectedYear,
			lunar: {
				dayInChinese,
				heavenlyStem,
				earthlyBranch,
			},
		};
	}

	function prevMonth() {
		let month = parseInt(dates.months);
		let year = parseInt(dates.years);

		if (month === 1) {
			dates.months = "12";
			dates.years = (year - 1).toString();
		} else {
			dates.months = (month - 1).toString();
		}
		dates.days = "1";
	}

	function nextMonth() {
		let month = parseInt(dates.months);
		let year = parseInt(dates.years);

		if (month === 12) {
			dates.months = "1";
			dates.years = (year + 1).toString();
		} else {
			dates.months = (month + 1).toString();
		}
		dates.days = "1";
	}

	function selectDay(calendarDay: CalendarDay) {
		dates.days = calendarDay.day.toString();
		dates.months = calendarDay.month.toString();
		dates.years = calendarDay.year.toString();
	}
</script>

<section
	class="min-h-[calc(100svh-80px)] relative flex items-start justify-center pt-[40px] px-4 bg-no-repeat bg-center bg-cover"
	style={`background-image: url(${image});`}
>
	<div class="bg-stone-900/20 backdrop-blur-[10px] p-[40px]">
		<div class="bg-stone-300">
			<div class="grid grid-cols-[1fr_480px] gap-[20px]">
				<div class="p-[16px]">
					<div class="flex items-center gap-[6px]">
						<Button hover c="hover:bg-white p-2 rounded-lg" onclick={prevMonth}>
							<ArrowLeftIcon />
						</Button>
						<div class="flex gap-[8px] items-center max-w-[358px] mx-auto">
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
				</div>
			</div>

			<div class="grid grid-cols-[auto_auto] gap-[20px] pr-[20px]">
				<div class="bg-white">
					<div class="grid grid-cols-7 place-items-center mt-[20px]">
						{#each weekDays as day}
							<div
								class="text-stone-900 text-sm font-normal font-['GT_Eesti_Pro_Display'] min-h-[32px] flex items-center"
							>
								{day}
							</div>
						{/each}
					</div>

					<div class="grid grid-cols-7 place-items-center">
						{#each calendarDays as calendarDay, idx}
							<button
								type="button"
								onclick={() => selectDay(calendarDay)}
								class={clsx(
									"min-w-23 p-1 border border-[0.50px] border-r-0 border-b-0 border-zinc-300 cursor-pointer transition-colors",
									calendarDay.isSelected && "bg-orange-500 text-white",
									!calendarDay.isCurrentMonth && "opacity-40",
								)}
							>
								<div class="flex justify-center gap-[14px] items-center">
									<div
										class={clsx(
											"px-[4.5px] min-w-[30px] min-h-[24px] text-stone-900 text-xl font-normal font-['GT_Eesti_Pro_Display'] flex justify-center items-center",
											calendarDay.isToday &&
												"bg-red-600 rounded-[33px] text-white",
											calendarDay.isSelected &&
												!calendarDay.isToday &&
												"text-white",
										)}
									>
										{calendarDay.day}
									</div>
									<div
										class={clsx(
											"text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']",
											calendarDay.isSelected && "text-white",
										)}
									>
										<div>{calendarDay.lunar.heavenlyStem}</div>
										<div>{calendarDay.lunar.earthlyBranch}</div>
									</div>
								</div>

								<div
									class={clsx(
										"text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display'] text-center",
										calendarDay.isSelected && "text-white",
									)}
								>
									{calendarDay.lunar.dayInChinese}
								</div>
							</button>
						{/each}
					</div>
				</div>

				<div class="w-fit">
					<BaziBlock
						bind:ref={baziBlockRef}
						hours={dates.hours}
						days={dates.days}
						months={dates.months}
						years={dates.years}
					/>

					<div class="flex justify-center gap-[20px] mt-10">
						<div
							class="text-stone-900 text-base font-normal font-['GT_Eesti_Pro_Display']"
						>
							{m.calculator_share()}
						</div>

						<Button
							hover
							c=""
							onclick={async () => {
								const { copyToClipboard } = await captureBlock(
									baziBlockRef,
									"calendar",
								);
								await copyToClipboard();
							}}><ShareIcon /></Button
						>
						<Button
							hover
							c=""
							onclick={async () => {
								const { downloadImage } = await captureBlock(
									baziBlockRef,
									"calendar",
								);
								await downloadImage();
							}}
						>
							<FileIcon />
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
