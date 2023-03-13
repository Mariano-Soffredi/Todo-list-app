import { useCallback, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
import { Todo as TodoModel } from '../../models/todo';
import * as TodosApi from '../../network/todos_api';
import styles from "../../styles/Home.module.css";
import styleUtils from "../../styles/utils.module.css";
import AddEditTodoDialog from "./AddEditTodoDialog";
import Todo from "./Todo";

const TodosPageView = () => {
  const { todos, loading, setTodos, error } = useFetch();
  const [showAddTodoDialog, setShowAddTodoDialog] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<TodoModel | null>(null);

  const deleteTodo = useCallback(async (todo: TodoModel) => {
    try {
      await TodosApi.deleteTodo(todo._id);
      setTodos(todos.filter(existingTodo => existingTodo._id !== todo._id));
    } catch (error) {
      console.error(error);
    }
  }, [setTodos, todos]);

  const todosGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.todosGrid}`}>
      {todos.map((todo) => (
        <Col key={todo._id}>
          <Todo
            todo={todo}
            className={styles.todo}
            onEditTodoClicked={setTodoToEdit}
            onDeleteTodoClicked={deleteTodo}
          />
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      <Button
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddTodoDialog(true)}>
        <FaPlus />
        Add new todo
      </Button>
      {loading && <Spinner animation="border" variant="primary" />}
      {!!error && <p>Something went wrong. Please refresh the page</p>}
      {!error && !loading &&
        <>
          {todos.length > 0
            ? todosGrid
            : <p>You don't have any todos yet</p>
          }
        </>
      }
      {showAddTodoDialog &&
        <AddEditTodoDialog
          onDismiss={() => setShowAddTodoDialog(false)}
          onTodoSaved={(newTodo) => {
            setTodos([...todos, newTodo]);
            setShowAddTodoDialog(false);
          }}
        />
      }
      {todoToEdit &&
        <AddEditTodoDialog
          todoToEdit={todoToEdit}
          onDismiss={() => setTodoToEdit(null)}
          onTodoSaved={(updatedTodo) => {
            setTodos(todos.map(existingTodo => existingTodo._id === updatedTodo._id ? updatedTodo : existingTodo));
            setTodoToEdit(null);
          }}
        />
      }</>
  );
}

export default TodosPageView;