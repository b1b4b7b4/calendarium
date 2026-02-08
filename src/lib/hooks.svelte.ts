import { goto, invalidateAll } from "$app/navigation";
import { page } from "$app/state";
import { api } from "$lib";
import { error } from "@sveltejs/kit"
import { get, writable, type Writable } from "svelte/store"
import { localizeHref } from "$lib/paraglide/runtime";
import toast from "svelte-french-toast";
import { m, phone_number } from "$lib/paraglide/messages";
import type { Bazi } from "./types";


export const useLoginMutation = () => {
	const loading = writable(false)
	const errors = writable({
		email: "",
		password: ""
	})
	const mainError = writable("")

	const login = async (data: { email: string, password: string }) => {
		loading.set(true)
		errors.set({
			email: "",
			password: ""
		})
		mainError.set("")

		try {
			loading.set(true)
			errors.set({
				email: "",
				password: ""
			})
			mainError.set("")

			const res = await api.post("/auth/login", data);
			goto(localizeHref(page.url.searchParams.get("redi") || "/"), {
				invalidateAll: true,
			})
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				mainError.set(e.response.data.error || e.response.data.detail);
			} else {
				errors.set(e.response?.data);
			}
		} finally {
			loading.set(false)
		}
	}

	return {
		loading,
		errors,
		mainError,
		login
	}
}


export const useForgotPasswordMutation = () => {
	const loading = writable(false)
	const errors = writable({
		email: "",
		code: "",
		password: "",
		confirm_password: "",
	})
	const mainError = writable("")


	const forgotPassword = async (step: Writable<number>, data: Partial<{
		email: string, code: string, password: string, confirm_password: string,
	}>) => {
		loading.set(true)
		errors.set({
			email: "",
			code: "",
			password: "",
			confirm_password: "",
		})
		mainError.set("")

		try {
			if (get(step) === 1) {
				await api.post("/user/send_reset_code", data);
				toast.success(m.forgot_code_sent_toast());
				step.set(2);
			} else if (get(step) === 2) {
				await api.post("/user/verify_reset_code", data);
				step.set(3);
			} else if (get(step) === 3) {
				await api.post("/user/set_new_password", data);
				goto(localizeHref("/login"));
			}
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				mainError.set(e.response.data.error || e.response.data.detail);
			} else {
				errors.set(e.response?.data);
			}
		} finally {
			loading.set(false)
		}
	}

	return {
		loading,
		errors,
		mainError,
		forgotPassword
	}
}


export const useRegisterMutation = () => {
	const loading = writable(false)
	const errors = writable({
		email: "",
		password: "",
		confirm_password: "",
	})
	const mainError = writable("")

	const register = async (data: { email: string, password: string, confirm_password: string }) => {
		loading.set(true)
		errors.set({
			email: "",
			password: "",
			confirm_password: "",
		})
		mainError.set("")

		try {
			const res = await api.post("/auth/register", data);
			goto(localizeHref("/"), { invalidateAll: true });
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				mainError.set(e.response.data.error || e.response.data.detail);
			} else {
				errors.set(e.response?.data);
			}
		} finally {
			loading.set(false)
		}
	}

	return {
		loading,
		errors,
		mainError,
		register
	}
}


export const useCreateConsultationMutation = () => {
	const loading = writable(false)
	const errors = writable({
		name: "",
		email: "",
		reason: "",
		description: "",
	})
	const mainError = writable("")

	const createConsultation = async (data: { name: string, email: string, reason: string, description: string }) => {
		loading.set(true)
		errors.set({
			name: "",
			email: "",
			reason: "",
			description: "",
		})
		mainError.set("")

		try {
			await api.post("/consultation", data);
			toast.success(m.contact_success_toast());
			return true;
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				mainError.set(e.response.data.error || e.response.data.detail);
			} else {
				errors.set(e.response?.data);
			}
		} finally {
			loading.set(false)
		}
	}

	return {
		loading,
		errors,
		mainError,
		createConsultation
	}
}


export const useCalculateRequestMutation = () => {
	const loading = writable(false)
	const errors = writable({
		hour: "",
		minute: "",
		day: "",
		month: "",
		year: "",
		gender: "",
	})

	const mainError = writable("")

	const result = writable<Bazi | null>()

	const calculate = async (data: { hour: number, minute: number, day: number, month: number, year: number, gender: string }) => {
		loading.set(true)
		errors.set({
			hour: "",
			minute: "",
			day: "",
			month: "",
			year: "",
			gender: "",
		})
		mainError.set("")

		try {
			const res = await api.post("/calculator", data);
			result.set(res.data.bazi);
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				mainError.set(e.response.data.error || e.response.data.detail);
			} else {
				errors.set(e.response?.data);
			}
		} finally {
			loading.set(false)
		}
	}

	return {
		loading,
		errors,
		mainError,
		calculate,
		result
	}
}


export const useCreateClientMutation = () => {
	const loading = writable(false)
	const errors = writable({
		gender: "",
		date_of_birth: "",
		name: "",
		email: "",
		phone_number: "",
		address: "",
		country: "",
		remark: "",
	})
	const mainError = writable("")

	const createClient = async (data: {

	}) => {
		loading.set(true)
		errors.set({
			name: "",
			email: "",
			phone_number: "",
			gender: "",
			date_of_birth: "",
			address: "",
			country: "",
			remark: "",
		})
		mainError.set("")

		try {
			await api.post("/clients", data);
			toast.success(m.calculator_data_saved_toast());
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				mainError.set(e.response.data.error || e.response.data.detail);
			} else {
				errors.set(e.response?.data);
			}
		} finally {
			loading.set(false)
		}
	}

	return {
		loading,
		errors,
		mainError,
		createClient
	}
}


// {
//    "id": 5,
//    "reason": "Другое"
//  }


export type Reason = {
	id: number;
	reason: string;
}
export const useReasonsQuery = () => {
	const reasons = writable<Reason[]>([])
	const loading = writable(false)
	const mainError = writable("")

	const fetchReasons = async () => {
		try {
			const res = await api.get("/reason");
			reasons.set(res.data);
		} catch (e: any) {
			if (e.response?.data?.error || e.response?.data?.detail) {
				mainError.set(e.response.data.error || e.response.data.detail);
			} else {
				mainError.set(e.response?.data);
			}
		} finally {
			loading.set(false)
		}
	}


	$effect(() => {
		fetchReasons();
	});

	return {
		reasons,
		fetchReasons,
		mainError,
		loading
	}
}
