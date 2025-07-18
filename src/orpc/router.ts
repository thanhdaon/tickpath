import { os } from "@orpc/server";
import { db } from "~/db/db";

const getAllStatuses = os.handler(async () => {
  return await db.query.statuses.findMany();
});

export const router = {
  statuses: {
    getAll: getAllStatuses,
  },
};
