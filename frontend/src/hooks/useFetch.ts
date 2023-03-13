import { useEffect, useState } from "react";
import { Todo as TodoModel } from "../models/todo";
import * as TodosApi from '../network/todos_api';

export default function useFetch() {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    try {
      setError(null)
      TodosApi.fetchTodos()
        .then(response => setTodos(response))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }, []);

  return { todos, loading, setTodos, error }
}