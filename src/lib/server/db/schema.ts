import { date, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

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
	date_of_birth: date('date_of_birth').notNull(),
	country: text('country'),
	email: text('email'),
	phone_number: text('phone_number'),
	address: text('address'),
	remark: text('remark'),
	created_at: timestamp('created_at').defaultNow(),
});

