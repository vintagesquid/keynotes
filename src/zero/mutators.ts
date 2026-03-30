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
  },
});
