import { Application } from "https://deno.land/x/oak/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import todosRoutes from "./routes/todos.ts";
import { connect } from "./helpers/db_client.ts";

connect();

const app = new Application();

app.use(async (ctx, next) => {
  console.log("middle ware");
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

const port = Deno.env.get("PORT") || 8000;
await app.listen({ port: 8000 });
