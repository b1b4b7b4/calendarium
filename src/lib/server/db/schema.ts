import type { InferSelectModel } from 'drizzle-orm';
import { boolean, date, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	first_name: text('first_name').notNull(),
	last_name: text('last_name').notNull(),
	email: text('email').unique().notNull().unique(),
	password: text('password').notNull(),
	phone_number: text('phone_number').notNull(),
	created_at: timestamp('created_at').defaultNow(),
	reset_code: text('reset_code'),
});

export type Users = InferSelectModel<typeof users>;



// Consultation (submitted requests)
// ├── id
// ├── name
// ├── email
// ├── reason → FK to Reason
// ├── description
// ├── created
// └── modified
export const consultations = pgTable('consultations', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	reason: text('reason').notNull(),
	description: text('description').notNull(),
	created_at: timestamp('created_at').defaultNow(),
});

export type Consultations = InferSelectModel<typeof consultations>;

// Client
// ├── id: UUID (auto-generated)
// ├── user: FK → UserProfile (the consultant who owns this client)
// ├── name: string
// ├── gender: "male" | "female"
// ├── date_of_birth: Date        ← This is key for Bazi calculation!
// ├── country: string
// ├── email: string (unique)
// ├── phone_number: string (unique)
// ├── address: string
// ├── remark: text (notes about client)
// ├── created: timestamp
// └── modified: timestamp

export const clients = pgTable('clients', {
	id: serial('id').primaryKey(),
	userId: integer("user_id").references(() => users.id),
	name: text('name').notNull(),
	gender: text('gender').notNull(),
	date_of_birth: timestamp('date_of_birth').notNull(),
	country: text('country'),
	email: text('email'),
	phone_number: text('phone_number'),
	address: text('address'),
	remark: text('remark'),
	created_at: timestamp('created_at').defaultNow(),
});

export type Clients = InferSelectModel<typeof clients>;

// | Model | Relation to Client | Fields |
// |-------|-------------------|--------|
// | MainImage | client = FK(Client) | id, image, client |
// | Remark | client = FK(Client) | id, client, date, remark |
// | Compass | indirect via MainImage | id, main_image, x, y, rotation |
// | Note | indirect via MainImage | id, main_image, x, y, title, description |

export const main_images = pgTable('main_images', {
	id: serial('id').primaryKey(),
	clientId: integer("client_id").references(() => clients.id),
	image: text('image').notNull(),
	created_at: timestamp('created_at').defaultNow(),
	src: text('src').notNull(),
});

export type MainImages = InferSelectModel<typeof main_images>;

export const compasses = pgTable('compasses', {
	id: serial('id').primaryKey(),
	mainImageId: integer("main_image_id").references(() => main_images.id),
	x: integer('x'),
	y: integer('y'),
	rotation: integer('rotation'),
	created_at: timestamp('created_at').defaultNow(),
	global: boolean('global').default(false),
	src: text('src').notNull(),
});

export type Compasses = InferSelectModel<typeof compasses>;

export const notes = pgTable('notes', {
	id: serial('id').primaryKey(),
	mainImageId: integer("main_image_id").references(() => main_images.id),
	x: integer('x').notNull(),
	y: integer('y').notNull(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	created_at: timestamp('created_at').defaultNow(),
});

export type Notes = InferSelectModel<typeof notes>;
