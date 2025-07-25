import { onError, os } from "@orpc/server";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db/db";
import {
  file,
  issue,
  label,
  priority,
  status,
  user,
  userProfile,
} from "~/db/schema";
import { generateS3UserAvatarUploadUrl } from "~/lib/s3";

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

const generateUserAvatarUploadUrl = base
  .input(z.object({ avatar: z.instanceof(File) }))
  .handler(async ({ input }) => {
    return await generateS3UserAvatarUploadUrl(input.avatar);
  });

const fileSchema = z.object({
  key: z.string(),
  bucket: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
  uploadedByUserId: z.string(),
});

const addFiles = base
  .input(z.object({ files: fileSchema.array() }))
  .handler(async ({ input: { files } }) => {
    const results = await db.insert(file).values(files).returning({
      id: file.id,
      key: file.key,
      bucket: file.bucket,
      filename: file.filename,
      mimeType: file.mimeType,
      uploadedByUserId: file.uploadedByUserId,
    });
    return results;
  });

const createUserProfile = base
  .input(z.object({ userId: z.string() }))
  .handler(async ({ input }) => {
    await db.insert(userProfile).values({
      userId: input.userId,
    });
  });

const updateUserProfileAvatar = base
  .input(z.object({ userId: z.string(), avatarFileId: z.number() }))
  .handler(async ({ input }) => {
    await db
      .update(userProfile)
      .set({ avatarFileId: input.avatarFileId })
      .where(eq(userProfile.userId, input.userId));
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
    createProfile: createUserProfile,
    updateProfileAvatar: updateUserProfileAvatar,
  },
  files: {
    generateUserAvatarUploadUrl,
    add: addFiles,
  },
};
