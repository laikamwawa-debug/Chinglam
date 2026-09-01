import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const registrations = sqliteTable(
  "registrations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    parentName: text("parent_name").notNull(),
    childName: text("child_name").notNull(),
    childAge: integer("child_age").notNull(),
    contactPhone: text("contact_phone").notNull(),
    contactEmail: text("contact_email"),
    course: text("course").notNull(),
    availability: text("availability").notNull(),
    supportNeeds: text("support_needs"),
    message: text("message"),
    consent: integer("consent", { mode: "boolean" }).notNull().default(false),
    status: text("status").notNull().default("new"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    statusIdx: index("idx_registrations_status").on(table.status),
    createdAtIdx: index("idx_registrations_created_at").on(table.createdAt),
  })
);

