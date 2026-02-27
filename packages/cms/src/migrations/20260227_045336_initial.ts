import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`psychoactives_aka\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`alias\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`psychoactives\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`psychoactives_aka_order_idx\` ON \`psychoactives_aka\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`psychoactives_aka_parent_id_idx\` ON \`psychoactives_aka\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`psychoactives_family_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`member\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`psychoactives\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`psychoactives_family_members_order_idx\` ON \`psychoactives_family_members\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`psychoactives_family_members_parent_id_idx\` ON \`psychoactives_family_members\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`psychoactives\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`image_caption\` text,
  	\`image_location\` text,
  	\`duration_chart_title\` text DEFAULT 'Duration Chart',
  	\`duration_chart_total\` text,
  	\`duration_chart_onset\` text,
  	\`duration_chart_coming_up\` text,
  	\`duration_chart_plateau\` text,
  	\`duration_chart_coming_down\` text,
  	\`duration_chart_after_effects\` text,
  	\`positive_effects\` text,
  	\`negative_effects\` text,
  	\`neutral_effects\` text,
  	\`dosage_table_title\` text DEFAULT 'Dosage Table',
  	\`dosage_table_threshold\` text,
  	\`dosage_table_light\` text,
  	\`dosage_table_common\` text,
  	\`dosage_table_strong\` text,
  	\`dosage_table_heavy\` text,
  	\`warnings\` text,
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`psychoactives_title_idx\` ON \`psychoactives\` (\`title\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`psychoactives_slug_idx\` ON \`psychoactives\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`psychoactives_updated_at_idx\` ON \`psychoactives\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`psychoactives_created_at_idx\` ON \`psychoactives\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`combos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`drug1\` text NOT NULL,
  	\`drug2\` text NOT NULL,
  	\`content\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`combos_slug_idx\` ON \`combos\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`combos_drug1_idx\` ON \`combos\` (\`drug1\`);`)
  await db.run(sql`CREATE INDEX \`combos_drug2_idx\` ON \`combos\` (\`drug2\`);`)
  await db.run(sql`CREATE INDEX \`combos_updated_at_idx\` ON \`combos\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`combos_created_at_idx\` ON \`combos\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`risks\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`drug1\` text NOT NULL,
  	\`drug2\` text NOT NULL,
  	\`combo\` text NOT NULL,
  	\`risk_level\` text NOT NULL,
  	\`confidence\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`risks_drug1_idx\` ON \`risks\` (\`drug1\`);`)
  await db.run(sql`CREATE INDEX \`risks_drug2_idx\` ON \`risks\` (\`drug2\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`risks_combo_idx\` ON \`risks\` (\`combo\`);`)
  await db.run(sql`CREATE INDEX \`risks_risk_level_idx\` ON \`risks\` (\`risk_level\`);`)
  await db.run(sql`CREATE INDEX \`risks_updated_at_idx\` ON \`risks\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`risks_created_at_idx\` ON \`risks\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`psychoactives_id\` integer,
  	\`combos_id\` integer,
  	\`risks_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`psychoactives_id\`) REFERENCES \`psychoactives\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`combos_id\`) REFERENCES \`combos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`risks_id\`) REFERENCES \`risks\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_psychoactives_id_idx\` ON \`payload_locked_documents_rels\` (\`psychoactives_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_combos_id_idx\` ON \`payload_locked_documents_rels\` (\`combos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_risks_id_idx\` ON \`payload_locked_documents_rels\` (\`risks_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`psychoactives_aka\`;`)
  await db.run(sql`DROP TABLE \`psychoactives_family_members\`;`)
  await db.run(sql`DROP TABLE \`psychoactives\`;`)
  await db.run(sql`DROP TABLE \`combos\`;`)
  await db.run(sql`DROP TABLE \`risks\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
}
