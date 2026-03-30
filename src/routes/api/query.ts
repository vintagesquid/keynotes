import type { APIEvent } from "@solidjs/start/server";
import { json } from "@solidjs/router";
import { handleQueryRequest } from "@rocicorp/zero/server";
import { mustGetQuery } from "@rocicorp/zero";
import { queries } from "../../zero/queries";
import { schema } from "../../zero/schema";

export async function POST(event: APIEvent) {
  const result = await handleQueryRequest(
    (name, args) => {
      const query = mustGetQuery(queries, name);
      return query.fn({ args, ctx: { userId: "anon" } });
    },
    schema,
    event.request,
  );

  return json(result);
}
