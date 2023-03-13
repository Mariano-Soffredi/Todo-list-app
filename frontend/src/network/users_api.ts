import { User } from "../models/user";
import * as TodosApi from './todos_api';

export async function getLoggedInUser(): Promise<User> {
  const response = await TodosApi.fetchData('/api/users', { method: "GET" });
  return response.json();
}

export interface SignUpCredentials {
  username: string,
  email: string,
  password: string
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await TodosApi.fetchData("/api/users/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials),
    });
  return response.json();
};

export interface LoginCredentials {
  username: string,
  password: string
}

export async function login(credentials: LoginCredentials) {
  const response = await TodosApi.fetchData("/api/users/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials),
    });
  return response.json();
};

export async function logout() {
  await TodosApi.fetchData("/api/users/logout", { method: "POST" });
}