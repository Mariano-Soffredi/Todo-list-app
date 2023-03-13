import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIdDefined";

//Current Database
import Database from "../database/mongoDB";
import { Todo } from "../models/database";

export const getTodos: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    const todos = await Database.getTodos(authenticatedUserId);
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

export const getTodo: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  const { todoId } = req.params;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(todoId)) throw createHttpError(400, "Invalid todo id");

    const todo = await Database.getTodo(todoId);

    if (!todo) throw createHttpError(404, "Todo not found");
    if (todo.userId?.toString() !== authenticatedUserId.toString()) throw createHttpError(401, "You cannot access this todo");

    res.status(200).json(todo);
  } catch (error) {
    next(error)
  }
};

interface CreateTodoBody {
  title?: string,
  description?: string,
}

export const createTodo: RequestHandler<unknown, unknown, CreateTodoBody, unknown> = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  const { title, description } = req.body

  try {
    assertIsDefined(authenticatedUserId);

    if (!title) throw createHttpError(400, "Todo must have a title");

    const newTodo = await Database.createTodo({
      userId: authenticatedUserId,
      title,
      description,
      tasks: []
    });

    res.status(201).json(newTodo)
  } catch (error) {
    next(error);
  }
};

interface UpdateTodoParams {
  todoId: string,
}

export const updateTodo: RequestHandler<UpdateTodoParams, unknown, Todo, unknown> = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  const { todoId } = req.params;
  const updatedTodo = req.body;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(todoId)) throw createHttpError(400, "Invalid todo id");
    if (!updatedTodo.title) throw createHttpError(400, "Todo must have a title");

    const todo = await Database.getTodo(todoId);

    if (!todo) throw createHttpError(404, "Todo not found");
    if (todo.userId?.toString() !== authenticatedUserId.toString()) throw createHttpError(401, "You cannot access this todo");

    const response = await Database.updateTodo(todoId, {...updatedTodo});

    res.status(200).json(response)
  } catch (error) {
    next(error);
  }
};

export const deleteTodo: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  const { todoId } = req.params

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(todoId)) throw createHttpError(400, "Invalid todo id");
    const todo = await Database.getTodo(todoId);

    if (!todo) throw createHttpError(404, "Todo not found");
    if (todo.userId?.toString() !== authenticatedUserId.toString()) throw createHttpError(401, "You cannot access this todo");

    await Database.deleteTodo(todoId);

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
};

export const createTask: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  const { todoId, task } = req.body;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(todoId)) throw createHttpError(400, "Invalid todo id");
    const todo = await Database.getTodo(todoId);

    if (!todo) throw createHttpError(404, "Todo not found");
    if (todo.userId?.toString() !== authenticatedUserId.toString()) throw createHttpError(401, "You cannot access this todo");

    const updatedTodo = await Database.createTask(todoId, task);
    
    res.status(201).json(updatedTodo);
  } catch (error) {
    next(error)
  }
}