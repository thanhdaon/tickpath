import { onError, os } from "@orpc/server";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db/db";
import { issue, label, priority, status, user } from "~/db/schema";

const base = os.use(
  onError((error) => {
    console.error(error);
  })
);

const getAllStatuses = base.handler(async () => {
  return await db.query.status.findMany({
    orderBy: [asc(status.id)],
  });
});

const getAllIssues = base.handler(async () => {
  const result = await db.query.issue.findMany({
    with: {
      labels: {
        columns: {
          labelId: true,
        },
      },
    },
    orderBy: [desc(issue.updatedAt)],
  });

  return result.map((issue) => ({
    ...issue,
    labels: issue.labels.map((label) => label.labelId),
  }));
});

const getAllPriorities = base.handler(async () => {
  return await db.query.priority.findMany({
    orderBy: [asc(priority.id)],
  });
});

const getAllLabels = base.handler(async () => {
  return await db.query.label.findMany({
    orderBy: [asc(label.name)],
  });
});

const getAllUsers = base.handler(async () => {
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
    orderBy: [desc(user.id)],
  });

  return results.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    status: user?.presence?.status,
    roles: user.roles.map((role) => role.roleId),
  }));
});

const updateIssueAssignee = base
  .input(z.object({ issueId: z.number(), userId: z.string().nullable() }))
  .handler(async ({ input }) => {
    await db
      .update(issue)
      .set({ assigneeId: input.userId })
      .where(eq(issue.id, input.issueId));
  });

const updateIssueStatus = base
  .input(z.object({ issueId: z.number(), statusId: z.string() }))
  .handler(async ({ input }) => {
    const foundIssue = await db.query.issue.findFirst({
      where: eq(issue.id, input.issueId),
    });

    if (foundIssue === undefined) {
      throw new Error(`issue ${input.issueId} not found`);
    }

    const foundStatus = await db.query.status.findFirst({
      where: eq(status.id, input.statusId),
    });

    if (foundStatus === undefined) {
      throw new Error(`status ${input.statusId} not found`);
    }

    await db
      .update(issue)
      .set({ statusId: input.statusId })
      .where(eq(issue.id, input.issueId));
  });

const updateIssuePriority = base
  .input(z.object({ issueId: z.number(), priorityId: z.string() }))
  .handler(async ({ input }) => {
    const foundIssue = await db.query.issue.findFirst({
      where: eq(issue.id, input.issueId),
    });

    if (foundIssue === undefined) {
      throw new Error(`issue ${input.issueId} not found`);
    }

    const foundPriority = await db.query.priority.findFirst({
      where: eq(priority.id, input.priorityId),
    });

    if (foundPriority === undefined) {
      throw new Error(`priority ${input.priorityId} not found`);
    }

    await db
      .update(issue)
      .set({ priorityId: input.priorityId })
      .where(eq(issue.id, input.issueId));
  });

export const router = {
  statuses: {
    getAll: getAllStatuses,
  },
  issues: {
    getAll: getAllIssues,
    updateAssignee: updateIssueAssignee,
    updateStatus: updateIssueStatus,
    updatePriority: updateIssuePriority,
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
