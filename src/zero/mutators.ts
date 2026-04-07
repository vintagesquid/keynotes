import { defineMutators, defineMutator } from "@rocicorp/zero";
import z from "zod";

export const mutators = defineMutators({
  tasks: {
    create: defineMutator(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
      async ({ args, tx }) => {
        await tx.mutate.tasks.insert({
          id: args.id,
          title: args.title,
        });
      },
    ),
    update: defineMutator(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        completedAt: z.number().nullable().optional(),
        scheduledAt: z.number().nullable().optional(),
      }),
      async ({ args, tx }) => {
        await tx.mutate.tasks.update(args);
      },
    ),
    delete: defineMutator(
      z.object({
        id: z.string(),
      }),
      async ({ args, tx }) => {
        await tx.mutate.tasks.delete(args);
      },
    ),
  },
});
