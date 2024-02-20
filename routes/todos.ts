import { Router, RouterContext } from "https://deno.land/x/oak@v6.5.0/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

import { getDb } from "../helpers/db_client.ts";

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

let todos: Todo[] = [];

router.get("/todos", async (ctx: RouterContext) => {
  const todosData = await getDb().collection("todos").find().toArray();

  const transformedTodo = todosData.map(
    (todo: { _id: ObjectId; text: string }) => {
      return {
        id: todo._id.toString(),
        text: todo.text,
      };
    }
  );

  ctx.response.body = { todos: transformedTodo };
});

router.post(
  "/todos",
  async ({ request, response }: { request: any; response: any }) => {
    const body = await request.body.json();

    const newTodo: Todo = {
      // id: new Date().toISOString(),
      text: body.text,
    };

    const id = await getDb().collection("todos").insertOne(newTodo);

    newTodo.id = id.$oid;

    todos.push(newTodo);
    response.body = { todo: newTodo };
  }
);

router.put(
  "/todos/:todoId",
  async ({
    request,
    response,
    params,
  }: {
    request: any;
    response: any;
    params: any;
  }) => {
    const tid = params.todoId!;

    const body = await request.body.json();

    await getDb()
      .collection("todos")
      .updateOne({ _id: new ObjectId(tid) }, { $set: { text: body.text } });

    // const todoIndex = todos.findIndex((todo) => todo.id === tid);
    // todos[todoIndex] = { id: todos[todoIndex].id, text: body.text };
    response.body = { message: "Todo updated!" };
  }
);

router.delete(
  "/todos/:todoId",
  async ({
    request,
    response,
    params,
  }: {
    request: any;
    response: any;
    params: any;
  }) => {
    const tid = params.todoId!;

    await getDb()
      .collection("todos")
      .deleteOne({ _id: new ObjectId(tid) });

    // todos = todos.filter((todo) => todo.id !== tid);
    response.body = { message: "Todo deleted!" };
  }
);

export default router;
