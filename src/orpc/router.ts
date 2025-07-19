import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db/db";
import { issue } from "~/db/schema";

const getAllStatuses = os.handler(async () => {
  return await db.query.status.findMany();
});

const getAllIssues = os.handler(async () => {
  const result = await db.query.issue.findMany({
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
  return await db.query.priority.findMany();
});

const getAllLabels = os.handler(async () => {
  return await db.query.label.findMany();
});

const getAllUsers = os.handler(async () => {
  const results = await db.query.user.findMany({
    with: {
      presence: {
        columns: {
          status: true,
        },
      },
      roles: {
        columns: {
          roleId: true,
        },
      },
    },
  });

  return results.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    status: user.presence.status,
    roles: user.roles.map((role) => role.roleId),
  }));
});

const updateIssueAssignee = os
  .input(z.object({ issueId: z.number(), userId: z.string().nullable() }))
  .handler(async ({ input }) => {
    await db
      .update(issue)
      .set({ assigneeId: input.userId })
      .where(eq(issue.id, input.issueId));
  });

export const router = {
  statuses: {
    getAll: getAllStatuses,
  },
  issues: {
    getAll: getAllIssues,
    updateAssignee: updateIssueAssignee,
  },
  priorities: {
    getAll: getAllPriorities,
  },
  labels: {
    getAll: getAllLabels,
  },
  users: {
    getAll: getAllUsers,
  },
};
