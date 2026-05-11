import { defineQueries, defineQuery } from "@rocicorp/zero";
import { zql } from "./schema";

export const queries = defineQueries({
  tasks: {
    all: defineQuery(() => {
      return zql.tasks;
    }),
    scheduledBetween: defineQuery(({ args }: { args: { start: number; end: number } }) => {
      return zql.tasks.where("scheduledAt", ">=", args.start).where("scheduledAt", "<=", args.end);
    }),
  },
});
