import type { APIEvent } from "@solidjs/start/server";
import { handleMutateRequest } from "@rocicorp/zero/server";
import { mustGetMutator } from "@rocicorp/zero";
import { mutators } from "../../zero/mutators";
import { dbProvider } from "../../db/db-provider";
import { json } from "@solidjs/router";

export async function POST(event: APIEvent) {
  const result = await handleMutateRequest(
    dbProvider,
    (transact) =>
      transact((tx, name, args) => {
        const mutator = mustGetMutator(mutators, name);
        return mutator.fn({ args, tx, ctx: { userId: "anon" } });
      }),
    event.request,
  );

  return json(result);
}
