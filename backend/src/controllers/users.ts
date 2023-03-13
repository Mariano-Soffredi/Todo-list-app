import { RequestHandler } from "express";
import createHttpError from "http-errors";
import bcrypt from 'bcrypt';

//Current Database
import Database from "../database/mongoDB";

import { User } from "../models/database";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await Database.getAuthenticatedUser(req.session.userId);
    if (!user) throw Error("User doesn't exists");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const signUp: RequestHandler<unknown, unknown, User, unknown> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) throw createHttpError(400, "Parameters missing");

    const existingEmail = await Database.getByEmail(email);
    if (existingEmail) throw createHttpError(409, "Email already in use. Please choose a different one or log in instead");

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await Database.createUser({
      username,
      email,
      password: passwordHashed
    });

    req.session.userId = newUser._id;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string,
  password?: string
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) throw createHttpError(400, "Parameters missing");

    const user = await Database.getByUsername(username);
    if (!user) throw createHttpError(401, "Invalid credentials");

    const passwordMatch = await bcrypt.compare(password, user.password || "");
    if (!passwordMatch) throw createHttpError(401, "Invalid credentials");

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy(error => {
    if (error) next(error);
    if (!error) res.sendStatus(200);
  })
};