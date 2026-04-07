import { defineQueries, defineQuery } from "@rocicorp/zero";
import { zql } from "./schema";

export const queries = defineQueries({
  tasks: {
    all: defineQuery(() => {
      return zql.tasks;
    }),
  },
});
