import { useEffect, useState } from "react";
import { Task, Todo } from "../models/todo";
import * as TodosApi from '../network/todos_api';

export default function useTodo() {
  const [todo, setTodo] = useState<Todo>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const todoId = window.location.search.slice(1);

  useEffect(() => {
    try {
      setError(null)
      TodosApi.fetchTodo(todoId)
        .then(response => setTodo(response))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }, [todoId]);

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (todo) setTasks(todo.tasks);
  }, [todo]);

  return { todo, tasks, loading, setTodo, error }
}