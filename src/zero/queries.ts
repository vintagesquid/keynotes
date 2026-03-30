import { defineQueries, defineQuery } from "@rocicorp/zero";
// import {z} from 'zod'
import { zql } from "./schema";

export const queries = defineQueries({
  tasks: {
    getAllTasks: defineQuery(() => {
      return zql.tasks;
    }),
  },
});
