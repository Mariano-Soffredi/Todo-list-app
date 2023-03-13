import mongoose, { Types } from "mongoose";
import { Database, Task, Todo, User } from "../models/database";
import { TodoModel, UserModel } from "./mongoDBSchemas";

class MongoDB implements Database {

  // Todos Database Methods

  async getTodos(userId: Types.ObjectId) {
    const todos = await TodoModel.find({ userId }).exec();
    return todos;
  }

  async getTodo(todoId: string) {
    const todo = await TodoModel.findById(todoId).exec();
    return todo;
  }

  async createTodo(Todo: Todo) {
    const newTodo = await TodoModel.create(Todo);
    return newTodo;
  }

  async updateTodo(todoId: string, update: object) {
    const todo = await this.getTodo(todoId);
    if (todo) Object.assign(todo, update);
    const updatedTodo = await todo?.save();
    return updatedTodo;
  }

  async deleteTodo(todoId: string) {
    const todo = await this.getTodo(todoId);
    await todo?.deleteOne();
  }

  async createTask(todoId: string, task: Task) {
    const todo = await this.getTodo(todoId);
    task._id = new mongoose.Types.ObjectId(32);
    task.completed = false;

    todo?.tasks?.push(task);
    const updatedTodo = await this.updateTodo(todoId, { ...todo });

    return updatedTodo;
  }

  // Users Database Methods

  async getAuthenticatedUser(userId?: Types.ObjectId) {
    const user = await UserModel.findById(userId).select("+email").exec();
    return user;
  }

  async getByEmail(email: string) {
    const user = await UserModel.findOne({ email }).exec();
    return user;
  }

  async getByUsername(username: string) {
    const user = await UserModel.findOne({ username }).select("+password +email").exec();
    return user;
  }

  async createUser(User: User) {
    const newUser = await UserModel.create(User);
    return newUser;
  }

}

export default new MongoDB