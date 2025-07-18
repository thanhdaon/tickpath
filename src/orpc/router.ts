import { os } from "@orpc/server";
import { db } from "~/db/db";

const getAllStatuses = os.handler(async () => {
  return await db.query.statuses.findMany();
});

const getAllIssues = os.handler(async () => {
  const result = await db.query.issues.findMany({
    with: {
      labels: {
        columns: {
          labelId: true,
        },
      },
    },
  });

  return result.map((issue) => ({
    ...issue,
    labels: issue.labels.map((label) => label.labelId),
  }));
});

const getAllPriorities = os.handler(async () => {
  return await db.query.priorities.findMany();
});

const getAllLabels = os.handler(async () => {
  return await db.query.labels.findMany();
});

export const router = {
  statuses: {
    getAll: getAllStatuses,
  },
  issues: {
    getAll: getAllIssues,
  },
  priorities: {
    getAll: getAllPriorities,
  },
  labels: {
    getAll: getAllLabels,
  },
};
