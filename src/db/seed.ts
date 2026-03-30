import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { tasks } from "./schema";
import { seed } from "drizzle-seed";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  await seed(db, { tasks });
}

main();
