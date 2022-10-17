// deno-lint-ignore-file require-await
import { GrpcServer } from "https://deno.land/x/grpc_basic@0.4.6/server.ts";
import { TodoList, Todos } from "./todo.d.ts";

const port = 50051;
const server = new GrpcServer();

const protoPath = new URL("todo.proto", import.meta.url);
const protoFile = await Deno.readTextFile(protoPath);

const list: Todos = { todos: [] };

server.addService<TodoList>(protoFile, {
  async ListTodo() {
    return { todos: list.todos };
  },

  async CreateTodo({ todo }) {
    const id = list.todos?.length;
    list.todos?.push({
      id,
      todo,
    });
    return { id, todo };
  },
});

console.log(`Listening on ${port}`);

for await (const conn of Deno.listen({ port })) {
  server.handle(conn);
}
