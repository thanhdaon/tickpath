import { relations, sql } from "drizzle-orm";
import {
  bigint,
  datetime,
  mysqlTable,
  primaryKey,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import { user } from "~/db/schema/auth";

export const issues = mysqlTable("issues", {
  id: bigint({ mode: "number", unsigned: true }).primaryKey().autoincrement(),
  identifier: varchar({ length: 50 }).notNull(),
  title: text().notNull(),
  description: text(),
  statusId: varchar({ length: 50 })
    .notNull()
    .references(() => statuses.id),
  assigneeId: varchar({ length: 36 }).references(() => user.id),
  priorityId: varchar({ length: 50 })
    .notNull()
    .references(() => priorities.id),
  createdAt: datetime()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const issuesRelations = relations(issues, ({ one, many }) => ({
  status: one(statuses, {
    fields: [issues.statusId],
    references: [statuses.id],
  }),
  assignee: one(user, {
    fields: [issues.assigneeId],
    references: [user.id],
  }),
  priority: one(priorities, {
    fields: [issues.priorityId],
    references: [priorities.id],
  }),
  labels: many(issuesLabels),
}));

export const issuesLabels = mysqlTable(
  "issues_labels",
  {
    issueId: bigint({ mode: "number", unsigned: true })
      .references(() => issues.id)
      .notNull(),
    labelId: varchar({ length: 50 })
      .references(() => labels.id)
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.issueId, t.labelId] })]
);

export const issuesLabelsRelations = relations(issuesLabels, ({ one }) => ({
  issue: one(issues, {
    fields: [issuesLabels.issueId],
    references: [issues.id],
  }),
  label: one(labels, {
    fields: [issuesLabels.labelId],
    references: [labels.id],
  }),
}));

export const statuses = mysqlTable("statuses", {
  id: varchar({ length: 50 }).primaryKey(),
  name: varchar({ length: 50 }).notNull(),
  color: varchar({ length: 50 }).notNull(),
});

export const statusesRelations = relations(statuses, ({ many }) => ({
  issues: many(issues),
}));

export const labels = mysqlTable("labels", {
  id: varchar({ length: 50 }).primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  color: varchar({ length: 50 }).notNull(),
});

export const labelsRelations = relations(labels, ({ many }) => ({
  issues: many(issuesLabels),
}));

export const priorities = mysqlTable("priorities", {
  id: varchar({ length: 50 }).primaryKey(),
  name: varchar({ length: 100 }).notNull(),
});

export const prioritiesRelations = relations(priorities, ({ many }) => ({
  issues: many(issues),
}));
