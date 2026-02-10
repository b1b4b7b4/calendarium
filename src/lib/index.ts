import { goto, invalidateAll } from "$app/navigation";
import axios from "axios";
import { writable, get } from "svelte/store";
import type { UserProfile } from "./types";
import { apiUrl, proxyUrl } from "./constants";
import toast from "svelte-french-toast";
import { m } from "./paraglide/messages";
import { localizeHref } from "./paraglide/runtime";
// @ts-ignore
import { Solar } from 'lunar-javascript';

// @ts-ignore
import domtoimage from "dom-to-image"

import dog from "$lib/assets/bazi/dog.png"
import dragon from "$lib/assets/bazi/dragon.png"
import goat from "$lib/assets/bazi/goat.png"
import horse from "$lib/assets/bazi/horse.png"
import monkey from "$lib/assets/bazi/monkey.png"
import ox from "$lib/assets/bazi/ox.png"
import pig from "$lib/assets/bazi/pig.png"
import rabbit from "$lib/assets/bazi/rabbit.png"
import rat from "$lib/assets/bazi/rat.png"
import rooster from "$lib/assets/bazi/rooster.png"
import snake from "$lib/assets/bazi/snake.png"
import tinger from "$lib/assets/bazi/tinger.png"


import tree from "$lib/assets/bazi/tree.png"
import soil from "$lib/assets/bazi/soil.png"
import sun from "$lib/assets/bazi/sun.png"
import rain from "$lib/assets/bazi/rain.png"
import fire from "$lib/assets/bazi/fire.png"
import gold from "$lib/assets/bazi/gold.png"
import iron from "$lib/assets/bazi/iro.png"
import mountain from "$lib/assets/bazi/mountain.png"
import seawater from "$lib/assets/bazi/seawater.png"


type Session = { user?: UserProfile };
export const currentSession = writable<Session>({});

export const locationSuggestionApi = axios.create({
	baseURL: "https://photon.komoot.io/api",
})

export const api = axios.create({
	baseURL: "/api",
	withCredentials: true
});

export function debounce(func: () => void, timeout = 300) {
	let timer: NodeJS.Timeout;
	return (...args: any) => {
		clearTimeout(timer);
		//@ts-ignore
		timer = setTimeout(() => { func.apply(this, args); }, timeout);
	};
}

export const settingsModal = writable(false);
export const asideModal = writable(false);

export const selectedMapCoords = writable<{ lat: number; lon: number }>({
	lat: 51.505,
	lon: -0.09,
});

export const genders = [
	{ id: 1, reason: "Male" },
	{ id: 2, reason: "Female" },
];



export function calculateBazi(props: { year: number, month: number, day: number, hour: number, minute: number }) {
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
export const elementMap = {
	"甲": { element: "Wood", yinYang: "Yang", icon: tree },
	"乙": { element: "Wood", yinYang: "Yin", icon: soil },
	"丙": { element: "Fire", yinYang: "Yang", icon: sun },
	"丁": { element: "Fire", yinYang: "Yin", icon: fire },
	"戊": { element: "Earth", yinYang: "Yang", icon: mountain },
	"己": { element: "Earth", yinYang: "Yin", icon: soil },
	"庚": { element: "Metal", yinYang: "Yang", icon: iron },
	"辛": { element: "Metal", yinYang: "Yin", icon: gold },
	"壬": { element: "Water", yinYang: "Yang", icon: seawater },
	"癸": { element: "Water", yinYang: "Yin", icon: rain },
} as any;

export const earthlyBranchMap = {
	"子": { element: "Water", animal: "Rat", icon: rat },
	"丑": { element: "Earth", animal: "Ox", icon: ox },
	"寅": { element: "Wood", animal: "Tiger", icon: tinger },
	"卯": { element: "Wood", animal: "Rabbit", icon: rabbit },
	"辰": { element: "Earth", animal: "Dragon", icon: dragon },
	"巳": { element: "Fire", animal: "Snake", icon: snake },
	"午": { element: "Fire", animal: "Horse", icon: horse },
	"未": { element: "Earth", animal: "Goat", icon: goat },
	"申": { element: "Metal", animal: "Monkey", icon: monkey },
	"酉": { element: "Metal", animal: "Rooster", icon: rooster },
	"戌": { element: "Earth", animal: "Dog", icon: dog },
	"亥": { element: "Water", animal: "Pig", icon: pig },
} as any;

export function parsePillar(ganzhi: string) {
	const heavenly = ganzhi[0];
	const earthly = ganzhi[1];
	const heavenlyInfo = elementMap[heavenly];
	const earthlyInfo = earthlyBranchMap[earthly];
	// return `(${heavenlyInfo.element}-${earthlyInfo.animal})`;
	return [heavenlyInfo.element, earthlyInfo.animal]
}


export async function captureBlock(ref: HTMLElement, filename = 'capture') {
	const dataUrl = await domtoimage.toPng(ref, {
		quality: 1,
		bgcolor: '#ffffff',
	});
	const copyToClipboard = async (): Promise<boolean> => {
		try {
			const response = await fetch(dataUrl);
			const blob = await response.blob();

			await navigator.clipboard.write([
				new ClipboardItem({ 'image/png': blob })
			]);

			toast.success('Copied to clipboard!');
			return true;
		} catch (err) {
			console.error('Failed to copy:', err);
			toast.error('Failed to copy to clipboard');
			return false;
		}
	};
	const downloadImage = async (): Promise<void> => {
		try {
			const link = document.createElement('a');
			link.download = `${filename}.png`;
			link.href = dataUrl;
			link.click();

			toast.success('Image downloaded!');
		} catch (err) {
			console.error('Failed to download:', err);
			toast.error('Failed to download image');
		}
	};
	return { dataUrl, copyToClipboard, downloadImage };
}


export const areYouSureContinue = writable(() => { })
export const areYouSureModalActive = writable(false)
export const areYouSureModalPending = writable(false)



