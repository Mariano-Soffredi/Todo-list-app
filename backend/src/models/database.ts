import { Types } from "mongoose";

export interface Task {
  _id?: Types.ObjectId
  title: string
  completed: boolean
}

export interface Todo {
  userId?: Types.ObjectId,
  title?: string,
  description?: string,
  tasks?: Array<Task>
}

export interface User {
  username?: string,
  email?: string,
  password?: string
}

export interface Database {
  // Todos
  getTodos(userId: unknown): Promise<Todo[]>;
  getTodo(todoId: string): Promise<Todo | unknown>;
  createTodo(todo: Todo): Promise<Todo | unknown>;
  updateTodo(todoId: string, update: object): Promise<Todo | unknown>;
  deleteTodo(todoId: string): void;

  // Tasks
  createTask(todoId: string, Task: Task): Promise<Todo | unknown>;

  // Users
  getAuthenticatedUser(userId: unknown): Promise<User | unknown>;
  getByEmail(email: string): Promise<User | unknown>;
  getByUsername(username: string): Promise<User | unknown>;
  createUser(User: User): Promise<User | unknown>;
}