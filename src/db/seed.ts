import { reset } from "drizzle-seed";
import { db } from "~/db/db";
import { faker } from "@faker-js/faker";
import * as authSchema from "~/db/schema/auth";
import * as othersSchema from "~/db/schema/others";

const schema = { ...othersSchema, ...authSchema };

type Issue = typeof schema.issues.$inferInsert;
type IssueLabel = typeof schema.issuesLabels.$inferInsert;

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

async function main() {
  await reset(db, schema);

  await db.insert(schema.statuses).values(statuses);
  await db.insert(schema.priorities).values(priorities);
  await db.insert(schema.labels).values(labels);
  await db.insert(schema.issues).values(generateIssues());

  const issues = await db.query.issues.findMany({ columns: { id: true } });
  const issueIds = issues.map((issue) => issue.id);

  await db.insert(schema.issuesLabels).values(generateIssueLabels(issueIds));
}

function generateIssues(): Issue[] {
  return Array.from({ length: 20 }, () => ({
    title: faker.lorem.words({ min: 3, max: 5 }),
    description: faker.lorem.words({ min: 3, max: 10 }),
    statusId: faker.helpers.arrayElement(statuses.map((s) => s.id)),
    priorityId: faker.helpers.arrayElement(priorities.map((p) => p.id)),
    identifier: faker.string.uuid(),
    createdAt: faker.date.recent(),
  }));
}

function generateIssueLabels(issueIds: number[]): IssueLabel[] {
  return issueIds.flatMap((issueId) =>
    faker.helpers
      .arrayElements(labelIds, { min: 1, max: 3 })
      .map((labelId) => ({ issueId, labelId }))
  );
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
