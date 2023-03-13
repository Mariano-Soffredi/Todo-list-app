import { debounce } from "lodash";
import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Task, Todo } from "../models/todo";

export async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (!response.ok) {
    const errorMessage = await response.json().then(response => response.error);
    if (response.status === 401) throw new UnauthorizedError(errorMessage);
    if (response.status === 409) throw new ConflictError(errorMessage);
    throw Error(`Request failes with status: ${response.status} message: ${errorMessage}`);
  };
  return response;
};

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetchData('/api/todos', { method: "get" })
  return response.json();
};

export async function fetchTodo(todoId: string): Promise<Todo> {
  const response = await fetchData(`/api/todos/${todoId}`, { method: "GET" });
  return response.json();
};

export interface TodoInput {
  title: string,
  description?: string
};

export async function createTodo(todo: TodoInput): Promise<Todo> {
  const response = await fetchData('/api/todos',
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(todo)
    });
  return response.json();
};

export async function updateTodo(todo: Todo, update?: object): Promise<Todo> {
  Object.assign(todo, update);
  const response = await fetchData(`/api/todos/${todo._id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(todo)
    });
  return response.json();
};

export const dbUpdateTodo = debounce(updateTodo, 800);

export async function deleteTodo(todoId: string) {
  await fetchData(`/api/todos/${todoId}`, { method: "DELETE" })
};

export async function createTask(todoId: string, task: Task) {
  const response = await fetchData('/api/todos/task',
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ todoId, task })
    });
  return response.json();
};

export async function updateTask(todo: Todo, currTask: Task, task: Task) {
  todo.tasks[todo.tasks.indexOf(currTask)] = Object.assign(currTask, { ...task });

  const updatedTodo = await updateTodo(todo);
  return updatedTodo;
};