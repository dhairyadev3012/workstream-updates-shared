import {
  pgTable, uuid, text, integer, boolean, timestamp, date, index,
} from "drizzle-orm/pg-core";

export const statuses = pgTable("statuses", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  colorKey: text("color_key").notNull().default("grey"), // green|amber|red|indigo|blue|grey
  isDefault: boolean("is_default").notNull().default(false),
  needsAttention: boolean("needs_attention").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tracks = pgTable("tracks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isArchived: boolean("is_archived").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sections = pgTable("sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  trackId: uuid("track_id").notNull()
    .references(() => tracks.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isArchived: boolean("is_archived").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  trackIdx: index("sections_track_idx").on(t.trackId),
}));

export const workstreams = pgTable("workstreams", {
  id: uuid("id").primaryKey().defaultRandom(),
  sectionId: uuid("section_id").notNull()
    .references(() => sections.id, { onDelete: "cascade" }),
  statusId: uuid("status_id")
    .references(() => statuses.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isArchived: boolean("is_archived").notNull().default(false),
  // Manually flagged from the admin panel, independent of status. A workstream
  // needs attention if this is set OR its status has needsAttention OR it is stale.
  needsAttentionOverride: boolean("needs_attention_override").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  sectionIdx: index("workstreams_section_idx").on(t.sectionId),
}));

export const updates = pgTable("updates", {
  id: uuid("id").primaryKey().defaultRandom(),
  workstreamId: uuid("workstream_id").notNull()
    .references(() => workstreams.id, { onDelete: "cascade" }),
  updateDate: date("update_date").notNull(), // YYYY-MM-DD, no time
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  // Multiple log entries per workstream per day are allowed (a running log,
  // not a single daily snapshot), so there is deliberately no uniqueness
  // constraint on (workstreamId, updateDate) here.
  workstreamDateIdx: index("updates_workstream_date_idx")
    .on(t.workstreamId, t.updateDate),
}));

export const settings = pgTable("settings", {
  key: text("key").primaryKey(), // dashboard_title | timezone | stale_after_days
  value: text("value").notNull(),
});
