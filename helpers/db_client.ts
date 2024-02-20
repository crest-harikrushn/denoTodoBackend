// import { config } from "https://deno.land/x/dotenv/mod.ts";

import "https://deno.land/x/dotenv/load.ts";

import {
  MongoClient,
  Database,
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";

let db: Database;

const client = new MongoClient();

const mongo_url = Deno.env.get("MONGO_URL") || "mongodb://127.0.0.1:27017";

export async function connect() {
  await client.connect(mongo_url);
  // await client.connect("mongodb://127.0.0.1:27017");

  db = client.database("todoDB");
}

connect();
// const todosCollection = db.collection("todos");

export function getDb() {
  return db;
}
