import { model, Schema, Types } from "mongoose";
import { Task, Todo, User } from "../models/database";

const taskSchema = new Schema<Task>({
  _id: {type: Types.ObjectId, required: true},
  title: {type: String, required: true},
  completed: {type: Boolean, required: true}
})

const todoSchema = new Schema<Todo>({
  userId: { type: Types.ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String },
  tasks: { type: [taskSchema] }
}, { timestamps: true });

export const TodoModel = model<Todo>("Todo", todoSchema);

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, select: false },
  password: { type: String, required: true, select: false }
})

export const UserModel = model<User>('User', userSchema)