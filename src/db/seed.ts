import { reset } from "drizzle-seed";
import { db } from "~/db/db";
import { faker } from "@faker-js/faker";
import * as schema from "~/db/schema";

type Issue = typeof schema.issue.$inferInsert;
type IssueLabel = typeof schema.issueToLabel.$inferInsert;
type User = typeof schema.user.$inferInsert;
type UserPresence = typeof schema.userPresence.$inferInsert;
type UserToRole = typeof schema.userToRole.$inferInsert;

const labels = [
  { id: "ui", name: "UI Enhancement", color: "purple" },
  { id: "bug", name: "Bug", color: "red" },
  { id: "feature", name: "Feature", color: "green" },
  { id: "documentation", name: "Documentation", color: "blue" },
  { id: "refactor", name: "Refactor", color: "yellow" },
  { id: "performance", name: "Performance", color: "orange" },
  { id: "design", name: "Design", color: "pink" },
  { id: "security", name: "Security", color: "gray" },
  { id: "accessibility", name: "Accessibility", color: "indigo" },
  { id: "testing", name: "Testing", color: "teal" },
  { id: "internationalization", name: "Internationalization", color: "cyan" },
];

const labelIds = labels.map((l) => l.id);

const priorities = [
  { id: "no-priority", name: "No priority" },
  { id: "urgent", name: "Urgent" },
  { id: "high", name: "High" },
  { id: "medium", name: "Medium" },
  { id: "low", name: "Low" },
];

const statuses = [
  { id: "in-progress", name: "In Progress", color: "#facc15" },
  { id: "technical-review", name: "Technical Review", color: "#22c55e" },
  { id: "completed", name: "Completed", color: "#8b5cf6" },
  { id: "paused", name: "Paused", color: "#0ea5e9" },
  { id: "to-do", name: "Todo", color: "#f97316" },
  { id: "backlog", name: "Backlog", color: "#ec4899" },
];

const roles = [
  { id: "admin", name: "Admin" },
  { id: "member", name: "Member" },
  { id: "viewer", name: "Viewer" },
];

async function main() {
  await reset(db, schema);

  await db.insert(schema.status).values(statuses);
  await db.insert(schema.priority).values(priorities);
  await db.insert(schema.label).values(labels);
  await db.insert(schema.userRole).values(roles);

  await db.insert(schema.user).values(generateUsers());
  const users = await db.query.user.findMany({ columns: { id: true } });
  const userIds = users.map((user) => user.id);

  await db.insert(schema.userPresence).values(generateUserPresences(userIds));
  await db.insert(schema.userToRole).values(generateUserToRoles(userIds));

  await db.insert(schema.issue).values(generateIssues(userIds));
  const issues = await db.query.issue.findMany({ columns: { id: true } });
  const issueIds = issues.map((issue) => issue.id);

  await db.insert(schema.issueToLabel).values(generateIssueLabels(issueIds));
}

function generateUsers(): User[] {
  return Array.from({ length: 30 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    emailVerified: faker.datatype.boolean(),
    image: faker.image.avatar(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }));
}

function generateUserPresences(userIds: string[]): UserPresence[] {
  return userIds.map((userId) => ({
    userId,
    status: faker.helpers.arrayElement(["online", "away", "offline"]),
  }));
}

function generateUserToRoles(userIds: string[]): UserToRole[] {
  return userIds.map((userId) => ({
    userId,
    roleId: faker.helpers.arrayElement(roles.map((r) => r.id)),
  }));
}

function generateIssues(userIds: string[]): Issue[] {
  return Array.from({ length: 20 }, () => ({
    title: faker.lorem.words({ min: 3, max: 5 }),
    description: faker.lorem.words({ min: 3, max: 10 }),
    statusId: faker.helpers.arrayElement(statuses.map((s) => s.id)),
    priorityId: faker.helpers.arrayElement(priorities.map((p) => p.id)),
    identifier: generateIssueIdentifier(),
    createdAt: faker.date.recent(),
    assigneeId: faker.helpers.arrayElement(userIds),
  }));
}

function generateIssueLabels(issueIds: number[]): IssueLabel[] {
  return issueIds.flatMap((issueId) =>
    faker.helpers
      .arrayElements(labelIds, { min: 1, max: 3 })
      .map((labelId) => ({ issueId, labelId }))
  );
}

function generateIssueIdentifier() {
  return `TIPA-${faker.number.int({ min: 1000, max: 9999 })}`;
}

main()
  .then(() => {
    console.log("Seeding completed successfully.");
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
  })
  .finally(() => {
    process.exit(0);
  });
