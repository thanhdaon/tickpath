import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdateFn(() => new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ one, many }) => ({
  accounts: many(account),
  sessions: many(session),
  presence: one(userPresence, {
    fields: [user.id],
    references: [userPresence.userId],
  }),
  roles: many(userToRole),
  files: many(file),
}));

export const session = pgTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const account = pgTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const verification = pgTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const issue = pgTable("issue", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  identifier: varchar({ length: 50 }).notNull(),
  title: text().notNull(),
  description: text(),
  statusId: varchar({ length: 50 })
    .notNull()
    .references(() => status.id),
  assigneeId: varchar({ length: 36 }).references(() => user.id),
  priorityId: varchar({ length: 50 })
    .notNull()
    .references(() => priority.id),
  createdAt: timestamp()
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const issueRelations = relations(issue, ({ one, many }) => ({
  status: one(status, {
    fields: [issue.statusId],
    references: [status.id],
  }),
  assignee: one(user, {
    fields: [issue.assigneeId],
    references: [user.id],
  }),
  priority: one(priority, {
    fields: [issue.priorityId],
    references: [priority.id],
  }),
  labels: many(issueToLabel),
}));

export const issueToLabel = pgTable(
  "issue_to_label",
  {
    issueId: bigint({ mode: "number" })
      .references(() => issue.id, { onDelete: "cascade" })
      .notNull(),
    labelId: varchar({ length: 50 })
      .references(() => label.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.issueId, t.labelId] })]
);

export const issueToLabelRelations = relations(issueToLabel, ({ one }) => ({
  issue: one(issue, {
    fields: [issueToLabel.issueId],
    references: [issue.id],
  }),
  label: one(label, {
    fields: [issueToLabel.labelId],
    references: [label.id],
  }),
}));

export const status = pgTable("status", {
  id: varchar({ length: 50 }).primaryKey(),
  name: varchar({ length: 50 }).notNull(),
  color: varchar({ length: 50 }).notNull(),
});

export const statusRelations = relations(status, ({ many }) => ({
  issues: many(issue),
}));

export const label = pgTable("label", {
  id: varchar({ length: 50 }).primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  color: varchar({ length: 50 }).notNull(),
});

export const labelRelations = relations(label, ({ many }) => ({
  issues: many(issueToLabel),
}));

export const priority = pgTable("priority", {
  id: varchar({ length: 50 }).primaryKey(),
  name: varchar({ length: 100 }).notNull(),
});

export const priorityRelations = relations(priority, ({ many }) => ({
  issues: many(issue),
}));

export const userPresence = pgTable("user_presence", {
  userId: varchar({ length: 36 })
    .references(() => user.id, { onDelete: "cascade" })
    .primaryKey(),
  status: varchar({ length: 10, enum: ["online", "away", "offline"] })
    .notNull()
    .default("offline"),
  lastUpdatedAt: timestamp()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const userPresenceRelations = relations(userPresence, ({ one }) => ({
  user: one(user, {
    fields: [userPresence.userId],
    references: [user.id],
  }),
}));

export const userRole = pgTable("user_role", {
  id: varchar({ length: 50 }).primaryKey(),
  name: varchar({ length: 100 }).notNull(),
});

export const userRoleRelations = relations(userRole, ({ many }) => ({
  users: many(userToRole),
}));

export const userToRole = pgTable(
  "user_to_role",
  {
    userId: varchar({ length: 36 })
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    roleId: varchar({ length: 50 })
      .references(() => userRole.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.roleId] })]
);

export const userToRoleRelations = relations(userToRole, ({ one }) => ({
  user: one(user, {
    fields: [userToRole.userId],
    references: [user.id],
  }),
  userRole: one(userRole, {
    fields: [userToRole.roleId],
    references: [userRole.id],
  }),
}));

export const userProfile = pgTable("user_profile", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 36 }).references(() => user.id, {
    onDelete: "cascade",
  }),
  avatarFileId: bigint({ mode: "number" }).references(() => file.id),
});

export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
  avatar: one(file, {
    fields: [userProfile.avatarFileId],
    references: [file.id],
  }),
}));

export const file = pgTable("file", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  key: text().notNull().unique(),
  bucket: text().notNull(),
  filename: text().notNull(),
  mimeType: text().notNull(),
  size: bigint({ mode: "number" }).notNull(),
  uploadedByUserId: varchar({ length: 36 }).references(() => user.id, {
    onDelete: "set null",
  }),
  uploadedAt: timestamp()
    .notNull()
    .$defaultFn(() => new Date()),
});

export const fileRelations = relations(file, ({ one }) => ({
  uploadedBy: one(user, {
    fields: [file.uploadedByUserId],
    references: [user.id],
  }),
}));
