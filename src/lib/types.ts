// API Types generated from OpenAPI spec

export interface Client {
	id?: string; // UUID, readOnly
	user?: number; // readOnly
	name: string;
	gender: 'male' | 'female';
	date_of_birth: string; // date format
	country: string;
	email: string;
	phone_number: string;
	address: string;
	remark: string;
}

export interface MainImageCreateUpdate {
	id?: string; // UUID, readOnly
	image?: string; // URI, readOnly
	client: string; // UUID
}

export interface CompassRead {
	id?: string; // UUID, readOnly
	main_image: MainImageCreateUpdate;
	x_coor: string;
	y_coor: string;
	rotation: number;
}

export interface Compass {
	id?: string; // UUID, readOnly
	main_image: string; // UUID
	x_coor: string;
	y_coor: string;
	rotation: number;
}

export interface MainImage {
	id?: string; // UUID, readOnly
	image?: string; // URI, readOnly
	client: Client;
}

export interface NoteRead {
	id?: string; // UUID, readOnly
	main_image: MainImageCreateUpdate;
	x_coor: string;
	y_coor: string;
	title: string;
	description: string;
}

export interface Note {
	id?: string; // UUID, readOnly
	main_image: string; // UUID
	x_coor: string;
	y_coor: string;
	title: string;
	description: string;
}

export interface RemarkRead {
	id?: string; // UUID, readOnly
	client: Client;
	date: string; // date-time
	remark: string;
}

export interface Remark {
	id?: string; // UUID, readOnly
	client: string; // UUID
	date: string; // date-time
	remark: string;
}

export interface TokenRefresh {
	refresh: string;
	access?: string;
}

export interface UserProfile {
	id?: number; // readOnly
	first_name?: string; // readOnly
	last_name?: string; // readOnly
	email?: string; // readOnly
	phone_number?: string; // nullable
}

export interface Login {
	email: string;
	password: string;
}

export interface PasswordValidation {
	email: string;
	password: string;
	confirm_password: string;
}

export interface UserProfileUpdate {
	id?: number; // readOnly
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
}
