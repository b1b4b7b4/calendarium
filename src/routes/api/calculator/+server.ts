import { json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";
import { validate, errorResponse } from "$lib/server/validation";

// @ts-ignore
import { Solar } from 'lunar-javascript';

const CalculatorDto = z.object({
	year: z.number().min(1900).max(2100),
	month: z.number().min(1).max(12),
	day: z.number().min(1).max(31),
	hour: z.number().min(0).max(23),
	minute: z.number().min(0).max(59),
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const jsonBody = await request.json();
		const dates = validate(CalculatorDto, jsonBody);
		return json({ success: true, bazi: calculateBazi(dates) });
	} catch (e: any) {
		if (e instanceof Response) {
			return e;
		}
		return errorResponse(e.message);
	}
};



function calculateBazi(props: { year: number, month: number, day: number, hour: number, minute: number }) {
	let { year, month, day, hour, minute } = props;

	if (hour >= 23) {
		const adjusted = new Date(year, month - 1, day, hour + 1, minute);
		year = adjusted.getFullYear();
		month = adjusted.getMonth() + 1;
		day = adjusted.getDate();
		hour = adjusted.getHours();
	}
	const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
	const lunar = solar.getLunar();
	const bazi = lunar.getEightChar();
	return {
		year: { ganzhi: bazi.getYear(), parsed: parsePillar(bazi.getYear()) },
		month: { ganzhi: bazi.getMonth(), parsed: parsePillar(bazi.getMonth()) },
		day: { ganzhi: bazi.getDay(), parsed: parsePillar(bazi.getDay()) },
		hour: { ganzhi: bazi.getTime(), parsed: parsePillar(bazi.getTime()) },
	};
}

// mozhno dobavitj kartinki sjuda dlya elementa i yiyanga
const elementMap = {
	"甲": { element: "Wood", yinYang: "Yang" },
	"乙": { element: "Wood", yinYang: "Yin" },
	"丙": { element: "Fire", yinYang: "Yang" },
	"丁": { element: "Fire", yinYang: "Yin" },
	"戊": { element: "Earth", yinYang: "Yang" },
	"己": { element: "Earth", yinYang: "Yin" },
	"庚": { element: "Metal", yinYang: "Yang" },
	"辛": { element: "Metal", yinYang: "Yin" },
	"壬": { element: "Water", yinYang: "Yang" },
	"癸": { element: "Water", yinYang: "Yin" },
} as any;
const earthlyBranchMap = {
	"子": { element: "Water", animal: "Rat" },
	"丑": { element: "Earth", animal: "Ox" },
	"寅": { element: "Wood", animal: "Tiger" },
	"卯": { element: "Wood", animal: "Rabbit" },
	"辰": { element: "Earth", animal: "Dragon" },
	"巳": { element: "Fire", animal: "Snake" },
	"午": { element: "Fire", animal: "Horse" },
	"未": { element: "Earth", animal: "Goat" },
	"申": { element: "Metal", animal: "Monkey" },
	"酉": { element: "Metal", animal: "Rooster" },
	"戌": { element: "Earth", animal: "Dog" },
	"亥": { element: "Water", animal: "Pig" },
} as any;

function parsePillar(ganzhi: string) {
	const heavenly = ganzhi[0];
	const earthly = ganzhi[1];
	const heavenlyInfo = elementMap[heavenly];
	const earthlyInfo = earthlyBranchMap[earthly];
	// return `(${heavenlyInfo.element}-${earthlyInfo.animal})`;
	return [heavenlyInfo.element, earthlyInfo.animal]
}
